import "./ArticleTimeline.scss"
import React, {useState} from 'react'
import Article from "/src/components/articles/base/Article.jsx"
import AvatarView from "/src/components/generic/AvatarView.jsx"
import {ArticleItemInfoForTimelines, ArticleItemInfoForTimelinesHeader, ArticleItemInfoForTimelinesTagsFooter, ArticleItemInfoForTimelinesBody} from "/src/components/articles/partials/ArticleItemInfoForTimelines.jsx"
import {useData} from "/src/providers/DataProvider.jsx"
import {useUtils} from "/src/hooks/utils.js"

const utils = useUtils()

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {Number} id
 * @return {JSX.Element}
 * @constructor
 */
function ArticleTimeline({ dataWrapper, id }) {
    const [selectedItemCategoryId, setSelectedItemCategoryId] = useState(null)
    const data = useData()

    // Emit schema.org employment structured data for the Experience section only,
    // so search engines and recruiter parsers can read the work history. Education
    // (which shares this renderer) is intentionally left untouched.
    const experienceJsonLd = dataWrapper.sectionId === "experience" ?
        _buildExperienceJsonLd(dataWrapper, data?.getProfile?.() || {}) :
        null

    return (
        <>
            {experienceJsonLd && (
                <script type={`application/ld+json`}
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(experienceJsonLd) }}/>
            )}

            <Article id={dataWrapper.uniqueId}
                     type={Article.Types.SPACING_DEFAULT}
                     dataWrapper={dataWrapper}
                     className={`article-timeline`}
                     selectedItemCategoryId={selectedItemCategoryId}
                     setSelectedItemCategoryId={setSelectedItemCategoryId}>
                <ArticleTimelineItems dataWrapper={dataWrapper}
                                      selectedItemCategoryId={selectedItemCategoryId}/>
            </Article>
        </>
    )
}

/**
 * Builds a schema.org Person graph describing the work history, using the
 * OrganizationRole idiom to attach a role title and dates to each employer.
 *
 * @param {ArticleDataWrapper} dataWrapper
 * @param {Object} profile
 * @return {Object}
 * @private
 */
function _buildExperienceJsonLd(dataWrapper, profile) {
    const isoMonth = (date) => {
        if (!(date instanceof Date) || isNaN(date.getTime())) return undefined
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    }

    const roles = dataWrapper.orderedItems.map((item) => {
        const roleName = item.locales.title ? utils.string.stripHTMLTags(item.locales.title) : undefined
        const organization = item.locales.institution
        const startDate = isoMonth(item.dateStart)
        const endDate = item.isOngoing ? undefined : isoMonth(item.dateEnd)

        const role = { "@type": "OrganizationRole" }
        if (roleName) role.roleName = roleName
        if (startDate) role.startDate = startDate
        if (endDate) role.endDate = endDate
        if (organization) role.worksFor = { "@type": "Organization", name: organization }

        return role
    })

    const person = { "@context": "https://schema.org", "@type": "Person" }
    if (profile?.name) person.name = profile.name
    if (roles.length > 0) person.worksFor = roles

    return person
}

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {String} selectedItemCategoryId
 * @return {JSX.Element}
 * @constructor
 */
function ArticleTimelineItems({ dataWrapper, selectedItemCategoryId }) {
    const filteredItems = dataWrapper.getOrderedItemsFilteredBy(selectedItemCategoryId)

    return (
        <ul className={`article-timeline-items`}>
            {filteredItems.map((itemWrapper, key) => (
                <ArticleTimelineItem itemWrapper={itemWrapper} 
                                     key={key}/>
            ))}

            <ArticleTimelineTrailingItem itemWrapper={null}/>
        </ul>
    )
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @return {JSX.Element}
 * @constructor
 */
function ArticleTimelineItem({ itemWrapper }) {
    return (
        <li className={`article-timeline-item`}>
            <AvatarView src={itemWrapper?.img}
                        faIcon={itemWrapper?.faIcon}
                        style={itemWrapper?.faIconStyle}
                        alt={itemWrapper?.imageAlt}
                        className={`article-timeline-item-avatar`}/>

            <ArticleItemInfoForTimelines className={`article-timeline-item-content`}>
                <ArticleItemInfoForTimelinesHeader itemWrapper={itemWrapper}
                                                   dateInterval={true}/>

                <ArticleItemInfoForTimelinesBody itemWrapper={itemWrapper}/>

                <ArticleItemInfoForTimelinesTagsFooter itemWrapper={itemWrapper}/>
            </ArticleItemInfoForTimelines>
        </li>
    )
}

/**
 * @return {JSX.Element}
 * @constructor
 */
function ArticleTimelineTrailingItem() {
    return (
        <li className={`article-timeline-item article-timeline-item-trailing`}>
            <AvatarView className={`article-timeline-item-avatar`}/>
        </li>
    )
}

export default ArticleTimeline
