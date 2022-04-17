import React, { useEffect, useState } from 'react'
import 'src/views/Consulter_formation/formation.css'
import photo1 from 'src/assets/images/Software-development.jpg'
import { CCard, CPagination, CPaginationItem } from '@coreui/react'
import { getFormations, getformationbycategorie } from 'src/services/FormationService'
import { Link, useNavigate } from 'react-router-dom'
import { uploadfile, getfile } from 'src/services/fileService'
import ReactImg from 'src/images/work-1.jpg'
import ReactImg1 from 'src/images/mobile_dev.jpg'
import ReactImg2 from 'src/images/work-3.jpg'
import ReactImg3 from 'src/images/work-5.jpg'
import ReactImg4 from 'src/images/Graphic_designer.jpg'
import ReactImg5 from 'src/images/work-6.jpg'
import { fetchUserData, GetformationsCandidat } from 'src/services/UserService'
const Mes_formations = (props) => {
  const [categorie, setCategorie] = useState(props)
  const [id, setId] = useState()

  const [posts, setPosts] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setpostsPerPage] = useState(3)
  const [NextPage, setNextPage] = useState(currentPage + 1)
  const [PreviewsPage, setPreviewsPage] = useState(1)
  const [activeNumber, setactiveNumber] = useState(1)
  const [selectValue, setselectValue] = useState('3')
  let navigate = useNavigate()
  let [images, setimages] = useState([])

  useEffect(() => {
    fetchUserData()
      .then((response2) => {
        console.log('id res', response2.data.id)
        setId(response2.data.id)
        console.log('id', id)
        GetformationsCandidat(response2.data.id)
          .then((response) => {
            console.log('sirine', response.data.length)
            if (response.data.length != 0) {
              response.data.reverse().map((item, index) => {
                console.log('item', item)
                getfile(item.image.id)
                  .then((response2) => {
                    images.push(URL.createObjectURL(response2.data))
                  })
                  .catch((e) => {})
              })
              setPosts(response.data.reverse())
            }
          })
          .catch((e) => {})
      })
      .catch((e) => {})
  }, [])
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

    //selcetionner nombre de posts per page
    const handleChange = (event) => {
      console.log(event.target.value)
      setselectValue(event.target.value)
      setpostsPerPage(selectValue)
    }

    return (
      <div>
        <CCard>
          <div className="container">
            <div className="row">
              <h3 style={{ marginTop: '15px', 'text-shadow': '2px 4px 3px rgba(0,0,0,0.3)' }}>
                {categorie.categorie}
              </h3>
              <h6 style={{ marginLeft: '15px', 'text-shadow': '2px 4px 3px rgba(0,0,0,0.3)' }}>
                {posts.length == 1 ? (
                  <span>une seule Formation Disponible</span>
                ) : (
                  <span>{posts.length} Formations Disponibles</span>
                )}
              </h6>
              {currentPosts.map((item, index) => (
                <div
                  className="col-lg-4 course_col"
                  style={{ marginTop: 25, marginRight: 0 }}
                  key={index}
                >
                  <div className="course">
                    <div className="project-wrap">
                      <a
                        href="#"
                        className="img"
                        style={{ 'background-image': `url(${images[index]})` }}
                      >
                        <span className="price">{item.categorie}</span>
                      </a>
                    </div>
                    <div className="course_body">
                      <h3 className="course_title" style={{ marginBottom: 25 }}>
                        <strong>
                          <Link to="/Consulter_formation/formations/formationInfo" state={item}>
                            {item.titre}
                          </Link>
                        </strong>
                      </h3>
                      <div className="course_text">
                        <p>{item.description.substr(0, 35)}...</p>
                      </div>
                      <div className="course_Date">
                        <strong>Date de publication :</strong> {item.dateCreation}
                      </div>
                    </div>
                    <div className="course_footer">
                      <div className="course_footer_content d-flex flex-row align-items-center justify-content-start">
                        <div className="course_info">
                          <i className="fa fa-graduation-cap" aria-hidden="true"></i>
                          <span>20 Student</span>
                        </div>
                        <div className="course_info">
                          <i className="fa fa-star" aria-hidden="true" />
                          <span>5 Ratings</span>
                        </div>
                        <div className="course_price ml-auto">{item.prix} DT</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <br></br>
          <CPagination
            className="justify-content-center"
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

          <div
            style={{ marginRight: 15, marginBottom: 15 }}
            className="d-flex flex-row align-items-center justify-content-start"
          >
            <div className="ml-auto clearfix">
              <div className="courses_show_text">
                <span className="courses_showing">1-{postsPerPage}</span> de{' '}
                <span className="courses_total">{posts.length}</span> resultats:
              </div>
              <div className="courses_show_content">
                <span>Voir: </span>
                <span></span>
                <span></span>
                <select onClick={handleChange}>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="8">8</option>
                </select>
              </div>
            </div>
          </div>
        </CCard>
      </div>
    )
  } else if (posts == null)
    return (
      <CCard>
        <div></div>
      </CCard>
    )
}
export default Mes_formations