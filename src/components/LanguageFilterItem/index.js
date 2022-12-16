import './index.css'

const LanguageFilterItem = props => {
  const {languageFiltersDetails, getSelectedLanguageId, isActiveBtn} = props
  const {id, language} = languageFiltersDetails
  const activeClassName = isActiveBtn ? 'active btn' : 'btn'

  const onClickLanguageBtn = () => {
    getSelectedLanguageId(id)
  }

  return (
    <li className="btn-item">
      <button
        type="button"
        className={activeClassName}
        onClick={onClickLanguageBtn}
      >
        {language}
      </button>
    </li>
  )
}

export default LanguageFilterItem
