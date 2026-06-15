import { useEffect } from 'react'

type PageMetaOptions = {
    title: string
    description: string
}

export const usePageMeta = ({ title, description }: PageMetaOptions) => {
    useEffect(() => {
        document.title = title

        let descriptionMeta = document.querySelector<HTMLMetaElement>(
            'meta[name="description"]',
        )

        if (!descriptionMeta) {
            descriptionMeta = document.createElement('meta')
            descriptionMeta.name = 'description'
            document.head.appendChild(descriptionMeta)
        }

        descriptionMeta.content = description
    }, [description, title])
}
