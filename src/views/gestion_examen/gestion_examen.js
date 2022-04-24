import {
  CCol,
  CForm,
  CFormCheck,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { CCard, CCardHeader, CFormTextarea } from '@coreui/react'
import 'src/views/gestion_demandes/demandes_inscriptions.css'

import { cilList, cilTrash, cilPencil, cilCheck } from '@coreui/icons'
import avatar8 from 'src/assets/images/logo1.jpg'
import { getfile } from 'src/services/fileService'

import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import {
  deleteorganisme,
  getAllorganismes,
  getpersonnelsByOrganisme,
} from 'src/services/organisme_conventionne'
import {
  ChangerEtatExamen,
  getAllExamens,
  deleteExamen,
  getQuestionByExamen,
} from 'src/services/examenService'
import { Modal, Button } from 'react-bootstrap'
import { getReponseByQuestion } from 'src/services/questionService'
import ConsulterQuestionsExamen from 'src/views/gestion_examen/consulterQuestionsExamen'
const Gestion_examen = () => {
  let navigate = useNavigate()
  const [profileimg, setProfileimg] = useState(avatar8)
  const [bool, setbool] = useState(false)
  const [bool2, setbool2] = useState(false)

  function notification_deValidation(id) {
    Swal.fire({
      title: 'Souhaitez-vous supprimer cet organisme ?',
      showDenyButton: true,
      confirmButtonText: 'valider',
      denyButtonText: `annuler`,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteorganisme(id)
          .then((response) => {
            console.log('data', response.data)
          })
          .catch((e) => {})

        Swal.fire('La suppression de ce organsime a réussi!', '', 'success')
        getAllorganismes()
          .then((response) => {
            console.log('data', response)
            response.data.map((item, index) => {
              console.log('alo')
              getfile(item.logo.id)
                .then((response) => {
                  images.push(URL.createObjectURL(response.data))
                  setProfileimg(URL.createObjectURL(response.data))
                  console.log('hello', response.data)
                })
                .catch((e) => {})
              getpersonnelsByOrganisme(item.id)
                .then((response2) => {
                  console.log('hello', response2)
                  nbrPersonnels.push(response2.data.length)
                })
                .catch((e) => {})
            })
            setPosts(response.data)
            console.log('data', response.data)
          })
          .catch((e) => {})
      } else if (result.isDenied) {
        Swal.fire('Les modifications ne sont pas enregistrées', '', 'info')
      }
    })
  }
  const [intitule, setintitule] = useState()
  const [duree, setduree] = useState()
  const [Showformation, setShowformation] = useState({})
  const [dateCreation, setdateCreation] = useState()
  const [dateMdf, setdateMdf] = useState()
  const [etat, setEtat] = useState()
  const [idexamen, setidexamen] = useState()
  const [Listquestions, setListquestions] = useState([])
  const [Listereponses, setreponses] = useState([])
  const [Listereponses2, setreponses2] = useState([])
  function ShowExamen(examen) {
    setidexamen(examen.id)
    setdateCreation(examen.dateCreation)
    setdateMdf(examen.dateMdf)
    setEtat(examen.etat)
    setShowformation(examen.formation)
    setduree(examen.duree)
    setintitule(examen.intitule)
    handleShowMdf()
    setbool(true)
    setbool(false)
  }
  const [showExamen, setshowExamen] = useState(false)
  const handleShowMdf = () => setshowExamen(true)
  const handleCloseExamen = () => {
    setshowExamen(false)
    setbool(true)
    setbool(false)
  }

  function UpdateExamen(item) {
    navigate('/gestion_examen/gestion_examen/updateExamen', { state: { UpdateExamen: item } })
  }
  function changerEtat(item) {
    console.log('ach jani', item)
    Swal.fire({
      title: 'Cet examen est ' + item.etat + '! ' + `Voulez vous changez l'état?`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'oui',
      denyButtonText: `Non`,
    }).then((result) => {
      if (result.isConfirmed) {
        ChangerEtatExamen(item.id)
          .then(() => {
            Swal.fire('Modification avec succes!', '', 'success')
            setbool(true)
            setbool(false)
          })
          .catch((e) => {})
      } else if (result.isDenied) {
        Swal.fire('Pas de changement!', '', 'info')
      }
    })
  }
  function supprimerExamen(id) {
    Swal.fire({
      title: 'Souhaitez-vous supprimer cet examen ?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'supprimer',
      denyButtonText: 'non',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteExamen(id)
          .then((response) => {
            setbool(true)
            setbool(false)
          })
          .catch((e) => {})

        Swal.fire('cet examen a été supprimé avec succes!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Les modifications ne sont pas enregistrées', '', 'info')
      }
    })
  }
  function Deleteorganisme(id) {
    notification_deValidation(id)
  }
  function Updateorganisme(id) {
    navigate('/gestion_organismes_conventionnes/organismes_conventionnes/updateOrganisme', {
      state: { organisme: id },
    })
  }
  function AjouterOrganisme() {
    navigate('/gestion_examen/gestion_examen/AjoutExamen')
  }
  const [posts, setPosts] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(6)
  const [NextPage, setNextPage] = useState(currentPage + 1)
  const [PreviewsPage, setPreviewsPage] = useState(1)
  const [activeNumber, setactiveNumber] = useState(1)
  let [images, setimages] = useState([])
  let [nbrPersonnels, setNbrPersonnels] = useState([])

  useEffect(() => {
    getAllExamens()
      .then((response) => {
        setPosts(response.data)
      })
      .catch((e) => {})
  }, [bool])
  console.log(nbrPersonnels)

  if (posts) {
    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage //3
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)
    // Change page
    const paginate = (pageNumber) => {
      setCurrentPage(pageNumber)
      if (pageNumber < posts.length / postsPerPage) setNextPage(pageNumber + 1)
      if (pageNumber > 1) setPreviewsPage(pageNumber - 1)
    }
    const pageNumbers = []

    for (let i = 1; i <= Math.ceil(posts.length / postsPerPage); i++) {
      pageNumbers.push(i)
    }
    return (
      <div>
        <div>
          <div className="col-12 text-end" style={{ height: '15px', marginBottom: '19px' }}>
            <button
              className="btn btn-outline-primary btn-sm mb-0"
              style={{ 'font-size': '18px' }}
              onClick={AjouterOrganisme}
            >
              <CIcon
                icon={cilList}
                customClassName="nav-icon"
                style={{
                  width: 20,
                  height: 20,
                  'margin-right': 5,
                }}
              />
              Ajouter un examen
            </button>
          </div>
          <Modal
            size="lg"
            show={showExamen}
            onHide={handleCloseExamen}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton style={{ color: '#213f77', fontWeight: 'bold' }}>
              <CIcon
                icon={cilPencil}
                style={{
                  marginRight: 15,
                }}
              />
              Examen
            </Modal.Header>
            <Modal.Body>
              <span>
                <ul
                  className="nav nav-pills mb-3"
                  id="pills-tab"
                  role="tablist"
                  style={{ marginLeft: '18%' }}
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="pills-home-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-home"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
                      aria-selected="true"
                      style={{
                        height: '50px',
                        width: '250px',
                        'font-size': '18 px',
                        'font-weight': 'bold',
                      }}
                    >
                      informations generales
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="pills-profile-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-profile"
                      type="button"
                      role="tab"
                      aria-controls="pills-profile"
                      aria-selected="false"
                      style={{
                        height: '50px',
                        width: '250px',
                        'font-size': '18 px',
                        'font-weight': 'bold',
                      }}
                    >
                      Questions
                    </button>
                  </li>
                </ul>
                <br></br>

                <div className="tab-content" id="pills-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="pills-home"
                    role="tabpanel"
                    aria-labelledby="pills-home-tab"
                  >
                    <div className="row mt-2">
                      <div className="col-md-6" style={{ paddingtop: 50 }}>
                        <label
                          className="labels"
                          style={{ 'font-size': '17px', 'font-weight': 'bold' }}
                        >
                          Intitule :
                        </label>
                        <span> {intitule}</span>
                        {/*                       <input type="text" className="form-control" placeholder="Amdouni" value="" />
                         */}{' '}
                      </div>
                      <div className="col-md-6">
                        <label
                          className="labels"
                          style={{ 'font-size': '17px', 'font-weight': 'bold' }}
                        >
                          Duree :
                        </label>
                        <span> {duree}</span> minutes
                        {/*                       <input type="text" className="form-control" value="" placeholder="Prenom" />
                         */}{' '}
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-md-6" style={{ paddingtop: 50 }}>
                        <label
                          className="labels"
                          style={{ 'font-size': '17px', 'font-weight': 'bold' }}
                        >
                          Formation :
                        </label>
                        <span> {Showformation.titre} </span> ({Showformation.categorie})
                        {/*                       <input type="text" className="form-control" placeholder="Amdouni" value="" />
                         */}{' '}
                      </div>
                      <div className="col-md-6">
                        <label
                          className="labels"
                          style={{ 'font-size': '17px', 'font-weight': 'bold' }}
                        >
                          etat :
                        </label>
                        <span> {etat}</span>
                        {/*                       <input type="text" className="form-control" value="" placeholder="Prenom" />
                         */}{' '}
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-md-6" style={{ paddingtop: 50 }}>
                        <label
                          className="labels"
                          style={{ 'font-size': '17px', 'font-weight': 'bold' }}
                        >
                          Date de Creation :
                        </label>
                        <span> {dateCreation}</span>
                        {/*                       <input type="text" className="form-control" placeholder="Amdouni" value="" />
                         */}{' '}
                      </div>
                      <div className="col-md-6">
                        <label
                          className="labels"
                          style={{ 'font-size': '17px', 'font-weight': 'bold' }}
                        >
                          Date de modification :
                        </label>
                        <span>{dateMdf}</span>
                        {/*                       <input type="text" className="form-control" value="" placeholder="Prenom" />
                         */}{' '}
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-profile"
                    role="tabpanel"
                    aria-labelledby="pills-profile-tab"
                  >
                    <ConsulterQuestionsExamen examen={idexamen}></ConsulterQuestionsExamen>
                  </div>
                </div>
              </span>
            </Modal.Body>
          </Modal>
        </div>
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-12">
              <div className="card my-4">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                  <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                    <h6
                      className="text-white ps-3"
                      style={{ 'font-weight': 'bold', 'font-size': '22px' }}
                    >
                      Liste des examens
                    </h6>
                  </div>
                </div>

                <div className="card-body px-0 pb-2">
                  <div className="table-responsive p-0">
                    <table className="table align-items-center mb-0">
                      <thead>
                        <tr>
                          <th className="text-center ">
                            <p
                              style={{
                                color: 'light',
                                'font-size': '15px',
                                'font-weight': 'bold',
                              }}
                            ></p>
                          </th>
                          <th className="text-center ">
                            <p
                              style={{
                                color: 'light',
                                'font-size': '15px',
                                'font-weight': 'bold',
                              }}
                            >
                              Id
                            </p>
                          </th>
                          <th className="text-center ">
                            <p
                              style={{
                                color: 'light',
                                'font-size': '15px',
                                'font-weight': 'bold',
                              }}
                            >
                              {' '}
                              intitule
                            </p>
                          </th>{' '}
                          <th className="text-center ">
                            <p
                              style={{
                                color: 'light',
                                'font-size': '15px',
                                'font-weight': 'bold',
                              }}
                            >
                              {' '}
                              Formation
                            </p>
                          </th>
                          <th className="text-center ">
                            <p
                              style={{
                                color: 'light',
                                'font-size': '15px',
                                'font-weight': 'bold',
                              }}
                            >
                              Durée
                            </p>
                          </th>
                          <th className="text-center ">
                            <p
                              style={{
                                color: 'light',
                                'font-size': '15px',
                                'font-weight': 'bold',
                              }}
                            >
                              {' '}
                              date de Creation
                            </p>
                          </th>
                          <th className="text-center ">
                            <p
                              style={{
                                color: 'light',
                                'font-size': '15px',
                                'font-weight': 'bold',
                              }}
                            >
                              {' '}
                              date de modification
                            </p>
                          </th>
                          <th className="text-center ">
                            <p
                              style={{
                                color: 'light',
                                'font-size': '15px',
                                'font-weight': 'bold',
                              }}
                            >
                              {' '}
                              Etat
                            </p>
                          </th>
                          <th className="text-center ">
                            <p
                              style={{
                                color: 'light',
                                'font-size': '15px',
                                'font-weight': 'bold',
                              }}
                            >
                              {' '}
                              Action
                            </p>
                          </th>
                          <th className="text-secondary opacity-7"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPosts.map((item, index) => (
                          <tr key={index}>
                            <td
                              className="align-middle text-center text-sm"
                              onClick={(index) => ShowExamen(item)}
                            ></td>
                            <td
                              className="align-middle text-center text-sm"
                              onClick={(index) => ShowExamen(item)}
                            >
                              <span
                                className="badge badge-sm"
                                style={{ color: 'black', 'font-size': '12px' }}
                              >
                                {item.id}
                              </span>
                            </td>
                            <td
                              className="align-middle text-center"
                              onClick={(index) => ShowExamen(item)}
                            >
                              <span className="text-secondary text-xs font-weight-bold">
                                {item.intitule}
                              </span>
                            </td>
                            <td
                              className="align-middle text-center"
                              onClick={(index) => ShowExamen(item)}
                            >
                              <span className="text-secondary text-xs font-weight-bold">
                                {item.formation.titre}
                              </span>
                            </td>{' '}
                            <td
                              className="align-middle text-center"
                              onClick={(index) => ShowExamen(item)}
                            >
                              <span className="text-secondary text-xs font-weight-bold">
                                {item.duree} minutes
                              </span>
                            </td>
                            <td
                              className="align-middle text-center"
                              onClick={(index) => ShowExamen(item)}
                            >
                              <span className="text-secondary text-xs font-weight-bold">
                                {item.dateCreation}
                              </span>
                            </td>
                            <td
                              className="align-middle text-center"
                              onClick={(index) => ShowExamen(item)}
                            >
                              <span className="text-secondary text-xs font-weight-bold">
                                {item.dateMdf}
                              </span>
                            </td>{' '}
                            <td className="align-middle text-center">
                              <span className="text-secondary text-xs font-weight-bold">
                                {item.etat === 'archivé' ? (
                                  <p
                                    onClick={(index) => changerEtat(item)}
                                    className="fa fa-eye-slash"
                                    aria-hidden="true"
                                    style={{ fontSize: 20, color: '#140788', paddingTop: '10' }}
                                    title="Non archivé"
                                  ></p>
                                ) : (
                                  <p
                                    onClick={(index) => changerEtat(item)}
                                    className="fa fa-eye"
                                    aria-hidden="true"
                                    style={{ fontSize: 20, color: '#140788', paddingTop: '10' }}
                                    title="Archiver"
                                  ></p>
                                )}
                              </span>
                            </td>
                            <td className="align-middle text-center">
                              <button
                                style={{
                                  border: 0,
                                  backgroundColor: 'transparent',
                                }}
                                onClick={(index) => supprimerExamen(item.id)}
                              >
                                <CIcon
                                  icon={cilTrash}
                                  customClassName="nav-icon"
                                  style={{
                                    marginTop: 5,
                                    width: 30,
                                    height: 30,
                                    color: 'red',
                                  }}
                                />
                              </button>
                              <button
                                style={{
                                  border: 0,
                                  backgroundColor: 'transparent',
                                }}
                                onClick={(index) => UpdateExamen(item.id)}
                              >
                                <CIcon
                                  icon={cilPencil}
                                  customClassName="nav-icon"
                                  style={{
                                    marginTop: 5,
                                    width: 30,
                                    height: 30,
                                    color: 'green',
                                  }}
                                />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ 'text-align': ' center' }}>
                      <br></br>
                      <CPagination
                        className="justify-content-end"
                        aria-label="Page navigation example"
                        style={{ marginRight: 20 }}
                      >
                        <a
                          onClick={() => {
                            if (PreviewsPage != 0) {
                              setCurrentPage(PreviewsPage)
                              paginate(PreviewsPage)
                              setactiveNumber(PreviewsPage)
                            }
                          }}
                        >
                          <CPaginationItem aria-label="Previous" disabled>
                            <span aria-hidden="true">&laquo;</span>
                          </CPaginationItem>
                        </a>
                        <a>
                          <CPaginationItem active>{activeNumber}</CPaginationItem>
                        </a>
                        <a
                          onClick={() => {
                            if (currentPage < posts.length / postsPerPage) {
                              setCurrentPage(NextPage)
                              paginate(NextPage)
                              setactiveNumber(NextPage)
                            }
                          }}
                        >
                          <CPaginationItem aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                          </CPaginationItem>
                        </a>
                      </CPagination>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else return <div>un probleme de connexion avec le serveur </div>
}
export default Gestion_examen
