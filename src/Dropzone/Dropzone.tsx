import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from './Dropzone.module.css'
import { X, FileText } from 'lucide-react'
import { useEvents } from '@/Pages/Events/Context/EventsContext'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'

interface DropzoneProps {
    className?: string
}

interface PreviewFile extends File {
    preview: string
}

const Dropzone: React.FC<DropzoneProps> = ({ className }) => {
    const { eventPhotos, handleFileUpload } = useEvents()
    const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([])

    useEffect(() => {
        const newPreviewFiles = eventPhotos.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) }),
        )
        setPreviewFiles(newPreviewFiles)

        return () =>
            newPreviewFiles.forEach((file) => URL.revokeObjectURL(file.preview))
    }, [eventPhotos])

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles?.length) {
                handleFileUpload([...eventPhotos, ...acceptedFiles])
            }
        },
        [eventPhotos, handleFileUpload],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': [],
        },
        maxSize: 1024 * 1000,
        onDrop,
    })

    const removeFile = (name: string) => {
        handleFileUpload(eventPhotos.filter((file) => file.name !== name))
    }

    const removeAll = () => {
        handleFileUpload([])
    }

    return (
        <div className={`${styles.dropzone} ${className}`}>
            <div {...getRootProps()} className={styles.dropzoneContent}>
                <input {...getInputProps()} />
                {previewFiles.length === 0 ? (
                    <>
                        <FileText className={styles.fileIcon} />
                        {isDragActive ? (
                            <p>Drop the files here ...</p>
                        ) : (
                            <p>
                                Drag & drop files here, or click to select files
                            </p>
                        )}
                    </>
                ) : (
                    <div className={styles.previewGrid}>
                        {previewFiles.map((file, i) => (
                            <div key={file.name + i} className={styles.previewItem}>
                                <FileText
                                    className={styles.fileIcon}
                                />
                                <div className={styles.fileName}>
                                    {file.name}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeFile(file.name)
                                    }}
                                    className={styles.removeButton}
                                >
                                    <X
                                        size={15}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {previewFiles.length > 0 && (
                <div className={styles.controls}>
                    <Button
                        color="#d32f2f"
                        backgroundColor="white"
                        borderColor="#d32f2f"
                        onClick={removeAll}
                        btnText={'Remove all files'}
                        type={ButtonTypes.PRIMARY}
                    />
                    <p className={styles.fileCount}>
                        {previewFiles.length} file(s) selected
                    </p>
                </div>
            )}
        </div>
    )
}

export default Dropzone
