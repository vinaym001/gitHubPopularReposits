import {Component} from 'react'

import Loader from 'react-loader-spinner'
import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'

import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
}

class GithubPopularRepos extends Component {
  state = {
    popularReposList: [],
    selectedLanguage: languageFiltersData[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getRepositoryItemsList()
  }

  getRepositoryItemsList = async () => {
    const {selectedLanguage} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const githubReposApiUrl = `https://apis.ccbp.in/popular-repos?language=${selectedLanguage}`
    const response = await fetch(githubReposApiUrl)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.popular_repos.map(eachItem => ({
        name: eachItem.name,
        id: eachItem.id,
        issuesCount: eachItem.issues_count,
        forksCount: eachItem.forks_count,
        starsCount: eachItem.stars_count,
        avatarUrl: eachItem.avatar_url,
      }))
      this.setState({
        popularReposList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <>
      <div testid="loader">
        <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
      </div>
    </>
  )

  renderFailView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="fail-img"
      />
      <h1>Something Went Wrong</h1>
    </>
  )

  renderSuccessView = () => {
    const {popularReposList} = this.state
    return (
      <ul className="repo-ul-container">
        {popularReposList.map(eachItem => (
          <RepositoryItem repoDetails={eachItem} key={eachItem.id} />
        ))}
      </ul>
    )
  }

  renderRepository = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  getSelectedLanguageId = id => {
    this.setState({selectedLanguage: id}, this.getRepositoryItemsList)
  }

  render() {
    const {selectedLanguage} = this.state
    return (
      <div className="bg-container">
        <h1 className="heading">Popular</h1>
        <ul className="ul-container">
          {languageFiltersData.map(eachItem => (
            <LanguageFilterItem
              languageFiltersDetails={eachItem}
              key={eachItem.id}
              isActiveBtn={eachItem.id === selectedLanguage}
              getSelectedLanguageId={this.getSelectedLanguageId}
            />
          ))}
        </ul>
        <div className="repo-container1">{this.renderRepository()}</div>
      </div>
    )
  }
}

export default GithubPopularRepos
