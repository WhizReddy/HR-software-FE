import React, { useRef } from 'react'
import { Camera } from 'lucide-react'

interface UploadImageProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const UploadImage: React.FC<UploadImageProps> = ({ onChange }) => {
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <>
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={onChange}
                className="hidden"
            />
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:underline mt-1"
            >
                <Camera size={14} />
                Change photo
            </button>
        </>
    )
}

export default UploadImage
