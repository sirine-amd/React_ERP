import React, { useEffect, useState } from 'react'
import photo1 from 'src/assets/images/Software-development.jpg'
import 'src/views/Consulter_formation/formationInfos.css'
import { Accordion, Modal, Button, Nav } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CoursByIdFormation } from 'src/services/CoursService'
import {
  GetformationsCandidat,
  sendMail,
  verifierFormationdeCandidat,
} from 'src/services/UserService'
import { fetchUserData, getUserById } from 'src/services/UserService'
import Swal from 'sweetalert2'
import {
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CCard,
  CCol,
} from '@coreui/react'
import Temoignageauth from './temoignageAuth'
import Temoignage from './temoignage'

import {
  addDemandeFormation,
  getdemandes_ins_formations,
  gethistorique,
} from 'src/services/demandes_inscriptionService'
import { getfile } from 'src/services/fileService'
import CIcon from '@coreui/icons-react'
import { cilExternalLink, cilPhone, cilSchool } from '@coreui/icons'
import { nombre_candidatsParFormation } from 'src/services/FormationService'
const FormationInfo = () => {
  const [typeCandidat, setTypeCandidat] = useState('candidatSimple')
  const [bool, setbool] = useState(false)

  useEffect(() => {
    fetchUserData()
      .then((response) => {
        getUserById(response.data.id).then((response) => {
          console.log('respose', response.data)
          if (response.data.organisme_conventionne === null) {
            setTypeCandidat('candidatSimple')
          } else {
            setTypeCandidat('PersonnelORG')
          }
        })
      })
      .catch((e) => {})
  }, [])

  const location = useLocation()
  const [values, setValues] = useState({
    titre: '',
    categorie: '',
    description: '',
    prix: '',
    nbrCours: '',
    id: '',
    prix_organismes_conventiones: '',
    image: '',
  })
  const [candidatinscrit, setCandidatinscrit] = useState('inscription')
  const [nbrcandidats, setnbrcandidats] = useState('')

  values.titre = location.state.titre
  values.id = location.state.id
  values.categorie = location.state.categorie
  values.prix = location.state.prix
  values.prix_organismes_conventiones = location.state.prix_organismes_conventiones
  values.nbrCours = location.state.nbrCours
  values.description = location.state.description
  let navigate = useNavigate()

  function voirFormation() {
    navigate('/Mes_formations/Mes_formations/ExamenInfo')
  }
  useEffect(() => {
    CoursByIdFormation(location.state.id)
      .then((response) => {
        setCours(response.data.reverse())
        console.log('cours', response.data)
      })
      .catch((e) => {})
    getfile(location.state.image.id)
      .then((response) => {
        values.image = URL.createObjectURL(response.data)
      })
      .catch((e) => {})
    nombre_candidatsParFormation(location.state.id)
      .then((response3) => {
        setnbrcandidats(response3.data)
      })
      .catch((e) => {})
    fetchUserData()
      .then((response) => {
        setIdCandidat(response.data.id)
        console.log('ach baathet', location.state)
        GetformationsCandidat(response.data.id).then((response) => {
          let test1 = false
          let test2 = false
          response.data.map((item, index) => {
            console.log('jawab', item)
            if (item.id === location.state.id) {
              test1 = true
              setCandidatinscrit('dejaInscrit')
            }
          })
          if (test1 === false) {
            getdemandes_ins_formations().then((response2) => {
              response2.data.map((item, index) => {
                console.log('jawab', item)
                if (item.candidat.id === IdCandidat && item.formation.id === location.state.id) {
                  setCandidatinscrit('demandeEnvoyée')
                  test2 = true
                }
              })
            })
            if (test2 === false) {
              setbool(true)
              gethistorique().then((response2) => {
                response2.data.map((item, index) => {
                  if (item.candidat.id === IdCandidat && item.formation.id === location.state.id) {
                    if (item.etat === 'refusée') {
                      setCandidatinscrit('demandeRefusée')
                    }
                  }
                })
              })
            }
          }
        })
      })
      .catch((e) => {})
  }, [bool])

  const [show, setShow] = useState(false)
  const [showphone, setShowphone] = useState(false)
  const [IdCandidat, setIdCandidat] = useState(0)
  const [cours, setCours] = useState([])
  const handleClose = () => setShow(false)
  const handleClosephone = () => setShowphone(false)
  const handleShow = () => {
    setShow(true)
  }
  const handleShowphone = () => {
    setShowphone(true)
  }
  const [values2] = useState({
    destinataire: '',
    body: '',
    topic: '',
  })
  const [values5] = useState({
    id: '',
    idcandidat: '',
    type: 'formation',
    etat: 'non traitée',
    dateCreation: '',
    formation: { id: '', titre: '' },
  })

  function Notification_probleme() {
    Swal.fire({
      icon: 'error',
      title: 'Probleme !',
      text: 'Quelque chose ne va pas ! Veuillez réessayer',
    })
  }
  function Notification_succes() {
    Swal.fire('Votre demande a été envoyée avec succès', ' ', 'success')
  }
  function Notification_failure() {
    Swal.fire({
      icon: 'error',
      title: 'Erreur dans le serveur',
      text: 'le serveur ne repond pas!',
    })
  }
  const envoyermail = () => {
    setShow(false)
    values5.formation.id = values.id
    values5.formation.titre = values.titre

    fetchUserData()
      .then((response) => {
        console.log('res', response.data)
        getUserById(response.data.id).then((response2) => {
          console.log('user', response2.data)
          values5.idcandidat = response2.data.id
          values2.destinataire = response2.data.email
        })
      })
      .catch((e) => {})

    values2.body = 'ok merci'
    values2.topic = 'Demande de inscription'

    sendMail(values2).then((response) => {
      if (response.status === 200) {
        console.log('values5', values5)
        values5.idcandidat = IdCandidat
        addDemandeFormation(values5).then((response3) => {
          if (response3.status === 200) {
            console.log('avec succée')
            Notification_succes()
            setCandidatinscrit('demandeEnvoyée')
          } else if (response3.status === 500) {
            Notification_failure()
          }
        })
      } else {
        Notification_probleme()
      }
    })
  }

  return (
    <div className="formationInfo">
      <div>
        <div className="container">
          <div>
            <CCard>
              <div
                className="row"
                style={{
                  marginTop: '20px',
                  marginRight: '5px',
                  marginLeft: '5px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <CCard style={{ backgroundColor: '#213f77' }}>
                    <div>
                      <div
                        style={{
                          marginTop: '30px',
                          marginRight: '20px',
                        }}
                      >
                        <button
                          onClick={() => handleShowphone()}
                          className="btn btn-outline-primary btn-sm mb-0"
                          style={{
                            float: 'right',
                            align: 'right',
                            'font-size': '20px',
                            'border-color': '#213f77',
                            paddingRight: '20px',
                            paddingLeft: '20px',
                            paddingTop: '15px',
                            paddingBottom: '20px',
                            marginTop: '20px',
                            backgroundColor: '#14bdee',
                            'border-radius': '15px',
                            height: '60px',
                          }}
                        >
                          <CIcon
                            icon={cilPhone}
                            customClassName="nav-icon"
                            style={{
                              width: 20,
                              height: 20,
                              'margin-right': 5,
                            }}
                          />
                          Nous Appeler
                        </button>
                        {candidatinscrit === 'inscription' ? (
                          <button
                            onClick={() => handleShow()}
                            className="btn btn-outline-primary btn-sm mb-0"
                            style={{
                              float: 'right',
                              align: 'right',
                              'font-size': '20px',
                              'border-color': '#213f77',
                              marginLeft: '30',
                              marginRight: '20',
                              paddingRight: '20px',
                              paddingLeft: '20px',
                              paddingTop: '15px',
                              paddingBottom: '20px',
                              marginTop: '20px',
                              backgroundColor: '#CAD7F9',
                              'border-radius': '15px',
                              height: '60px',
                            }}
                          >
                            {' '}
                            <i
                              className="fa fa-plus"
                              aria-hidden="true"
                              style={{ paddingRight: '10', marginRight: '5px' }}
                            ></i>
                            S{"'"}inscrire au cours
                          </button>
                        ) : (
                          <span>
                            {candidatinscrit === 'dejaInscrit' ? (
                              <Link
                                to="/Mes_formations/Mes_formations/FormationInfo"
                                state={location.state}
                              >
                                <button
                                  onClick={() => voirFormation()}
                                  className="btn btn-outline-primary btn-sm mb-0"
                                  style={{
                                    float: 'right',
                                    align: 'right',
                                    'font-size': '20px',
                                    'border-color': '#213f77',
                                    marginLeft: '10',
                                    marginRight: '20',
                                    paddingRight: '20px',
                                    paddingLeft: '20px',
                                    paddingTop: '15px',
                                    paddingBottom: '20px',
                                    marginTop: '20px',
                                    backgroundColor: '#2EC938',
                                    'border-radius': '15px',
                                    height: '60px',
                                  }}
                                >
                                  <i
                                    className="fa fa-check"
                                    aria-hidden="true"
                                    style={{ paddingRight: '10', marginRight: '5px' }}
                                  ></i>
                                  Deja inscrit
                                </button>
                              </Link>
                            ) : (
                              <span>
                                {candidatinscrit === 'demandeEnvoyée' ? (
                                  <button
                                    className="btn btn-outline-primary btn-sm mb-0"
                                    style={{
                                      float: 'right',
                                      align: 'right',
                                      'font-size': '20px',
                                      'border-color': '#213f77',
                                      marginLeft: '10',
                                      marginRight: '20',
                                      paddingRight: '20px',
                                      paddingLeft: '20px',
                                      paddingTop: '15px',
                                      paddingBottom: '20px',
                                      marginTop: '20px',
                                      backgroundColor: '#2EC938',
                                      'border-radius': '15px',
                                      height: '60px',
                                    }}
                                  >
                                    <i
                                      className="fa fa-check"
                                      aria-hidden="true"
                                      style={{ paddingRight: '10', marginRight: '5px' }}
                                    ></i>
                                    demande Envoyée
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-outline-primary btn-sm mb-0"
                                    style={{
                                      float: 'right',
                                      align: 'right',
                                      'font-size': '20px',
                                      'border-color': '#213f77',
                                      marginLeft: '10',
                                      marginRight: '20',
                                      paddingRight: '20px',
                                      paddingLeft: '20px',
                                      paddingTop: '20px',
                                      paddingBottom: '20px',
                                      marginTop: '20px',
                                      backgroundColor: '#AD0303',
                                    }}
                                  >
                                    <i
                                      className="fa fa-times"
                                      aria-hidden="true"
                                      style={{ paddingRight: '10', marginRight: '5px' }}
                                    ></i>
                                    demande Refusée
                                  </button>
                                )}
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                      <div
                        className="formation_title"
                        style={{ marginLeft: '30px', color: 'white' }}
                      >
                        {' '}
                        Formation :{values.titre}
                        <p style={{ marginLeft: '30px', 'font-size': '20px', color: '#C5CACD' }}>
                          {' '}
                          Categorie :{values.categorie}
                        </p>
                      </div>
                    </div>
                  </CCard>
                </div>
                <div className="col-lg-6">
                  <div className="formation_container">
                    {/*               <CCard>
                  <div className="formation_title"> Formation :{values.titre}</div>
                </CCard>
                  */}
                    <div className="formation_image">
                      <img src={values.image} alt="" style={{ width: 400, height: 250 }} />
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="sidebarFormation2">
                    <div className="sidebarFormation_section">
                      <div
                        className="sidebarFormation_section_title"
                        style={{ 'font-size': '2em' }}
                      >
                        Détails formation
                      </div>
                      <div className="sidebarFormation_feature">
                        <div className="formation_price">
                          {typeCandidat === 'candidatSimple' ? (
                            <p>{values.prix} Dt</p>
                          ) : (
                            <p> {values.prix_organismes_conventiones} Dt</p>
                          )}{' '}
                        </div>

                        <div className="feature_list">
                          <div className="feature d-flex flex-row align-items-center justify-content-start">
                            <div className="feature_title">
                              <i className="fa fa-file-text-o" aria-hidden="true"></i>
                              <span>Nombre des cours: {values.nbrCours}</span>
                            </div>
                          </div>

                          <div className="feature d-flex flex-row align-items-center justify-content-start">
                            <div className="feature_title">
                              <i className="fa fa-list-alt" aria-hidden="true"></i>
                              <span style={{ marginRight: 50 }}>Catégorie: {values.categorie}</span>
                            </div>
                          </div>

                          <div className="feature d-flex flex-row align-items-center justify-content-start">
                            <div className="feature_title">
                              <i className="fa fa-users" aria-hidden="true"></i>
                              <span>Candidats inscrits: {nbrcandidats}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Modal
                      show={show}
                      onHide={handleClose}
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Demande d{"'"}inscription</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        Cette formation coûte{' '}
                        {typeCandidat === 'candidatSimple' ? (
                          <span> {values.prix} Dt</span>
                        ) : (
                          <span> {values.prix_organismes_conventiones} Dt</span>
                        )}{' '}
                        si vous êtes sur de s{"'"}inscrire cliquer sur envoyer et un agent va
                        bientôt vous contacter pour fixer un rendez-vous pour venir chez nous et
                        payer le montant demandé.
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          Fermer
                        </Button>
                        <Button style={{ height: 39 }} variant="primary" onClick={envoyermail}>
                          Envoyer
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </div>
              </div>
            </CCard>
            <CCard style={{ marginTop: '10px' }}>
              <div>
                <div
                  className="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  <div className="tab_panels">
                    <div className="tab_panel active">
                      <div className="tab_panel_title">Description du {values.titre}</div>
                      <div>
                        <div className="tab_panel_text">
                          <p>{values.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-contact"
                  role="tabpanel"
                  aria-labelledby="pills-contact-tab"
                ></div>
              </div>
            </CCard>
            <CCard style={{ marginTop: '30px', paddingBottom: '30px' }}>
              <CCol>
                {cours != null && (
                  <div
                    className="tab_panel_title"
                    style={{ marginBottom: 20, marginTop: 15, marginLeft: 28 }}
                  >
                    Contenu du cours
                  </div>
                )}
                {cours.length !== 0 && (
                  <CAccordion activeItemKey={2}>
                    {cours.map((item, index) => (
                      <CAccordionItem Key={index} itemKey={index}>
                        <CAccordionHeader>
                          Cours N° {index + 1} : {item.titre}
                        </CAccordionHeader>
                        <CAccordionBody>
                          <strong>Description</strong>
                          <p style={{ 'word-wrap': 'break-word' }}>{item.description}</p>
                          <strong>Objectif</strong>
                          <p style={{ 'word-wrap': 'break-word' }}>{item.objectif}</p>
                        </CAccordionBody>
                      </CAccordionItem>
                    ))}
                  </CAccordion>
                )}
              </CCol>
            </CCard>
            {candidatinscrit === 'dejaInscrit' ? (
              <Temoignageauth formation={location.state.id}></Temoignageauth>
            ) : (
              <Temoignage formation={location.state.id}></Temoignage>
            )}
          </div>
        </div>
      </div>
      <Modal
        show={showphone}
        onHide={handleClosephone}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Nous sommes là pour vous aider</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Nous sommes à votre écoute du lundi au vendredi de 9h à 19h, heure en Tunisie.{' '}
          <p
            style={{
              color: 'blue',
              'text-align': 'center',
              'font-size': '30px',
              'font-weight': 'bold',
            }}
          >
            +27 76 41 04 80
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClosephone}>Fermer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
export default FormationInfo
