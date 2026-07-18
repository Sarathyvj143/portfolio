import "./ArticleResumeButton.scss"
import React, {useState} from 'react'
import Article from "/src/components/articles/base/Article.jsx"
import GestureAwareButton from "/src/components/buttons/GestureAwareButton.jsx"
import {useData} from "/src/providers/DataProvider.jsx"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import {useFeedbacks} from "/src/providers/FeedbacksProvider.jsx"
import {useUtils} from "/src/hooks/utils.js"

/**
 * Renders a resume-download call-to-action button.
 * The download is routed through utils.file.download(), which resolves the path
 * against import.meta.env.BASE_URL, so it works both locally ("/") and on
 * GitHub Pages ("/portfolio/").
 *
 * @param {ArticleDataWrapper} dataWrapper
 * @param {Number} id
 * @return {JSX.Element}
 * @constructor
 */
function ArticleResumeButton({ dataWrapper, id }) {
    const [selectedItemCategoryId, setSelectedItemCategoryId] = useState(null)

    const data = useData()
    const language = useLanguage()
    const feedbacks = useFeedbacks()
    const utils = useUtils()

    const profile = data.getProfile()
    const resumeUrl = profile?.resumePdfUrl
    const label = language.getString("download_resume")

    const _onClick = () => {
        if(!resumeUrl) {
            feedbacks.displayNotification(
                language.getString("error"),
                language.getString("error_file_not_found"),
                "error"
            )
            return
        }

        utils.file.download(resumeUrl)
    }

    return (
        <Article id={dataWrapper.uniqueId}
                 type={Article.Types.SPACING_SMALL}
                 dataWrapper={dataWrapper}
                 className={`article-resume-button`}
                 selectedItemCategoryId={selectedItemCategoryId}
                 setSelectedItemCategoryId={setSelectedItemCategoryId}>
            <div className={`article-resume-button-wrapper`}>
                <GestureAwareButton className={`article-resume-button-cta`}
                                    onClick={_onClick}
                                    tooltip={label}
                                    ariaLabel={label}>
                    <i className={`fa-solid fa-file-arrow-down article-resume-button-icon`}/>
                    <span className={`article-resume-button-label`}>{label}</span>
                </GestureAwareButton>
            </div>
        </Article>
    )
}

export default ArticleResumeButton
