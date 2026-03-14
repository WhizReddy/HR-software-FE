import { useState, useCallback, useEffect } from 'react'
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api'
import Input from '@/Components/Input/Index'
import { Search } from 'lucide-react'

const mapContainerStyle = {
    width: '100%',
    height: '400px',
}

const center = {
    lat: 41.3275,
    lng: 19.8189,
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
    | string
    | undefined

type LatLngLiteral = google.maps.LatLngLiteral
type MapType = google.maps.Map

interface MapComponentProps {
    onLocationChange: (address: string, lat: number, lng: number) => void
    savedLocation?: string
    showInput?: boolean
}

const libraries = ['places', 'marker'] as any

const MapComponent: React.FC<MapComponentProps> = ({
    onLocationChange,
    savedLocation,
    showInput,
}) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY || '',
        libraries,
    })

    const [map, setMap] = useState<MapType | null>(null)
    const [searchValue, setSearchValue] = useState('')
    const [markerPosition, setMarkerPosition] = useState<LatLngLiteral | null>(
        null,
    )

    const onLoad = useCallback((map: MapType) => {
        setMap(map)
    }, [])

    const onUnmount = useCallback(() => {
        setMap(null)
    }, [])

    useEffect(() => {
        if (savedLocation && isLoaded) {
            const geocoder = new google.maps.Geocoder()
            geocoder.geocode({ address: savedLocation }, (results, status) => {
                if (
                    status === google.maps.GeocoderStatus.OK &&
                    results &&
                    results[0]
                ) {
                    const position = results[0].geometry.location.toJSON()
                    setMarkerPosition(position)
                    setSearchValue(savedLocation)
                    if (map) {
                        map.panTo(position)
                        map.setZoom(15)
                    }
                } else {
                    console.error(
                        'Geocode was not successful for the following reason: ' +
                        status,
                    )
                }
            })
        }
    }, [savedLocation, map, isLoaded])

    const handleSearch = () => {
        if (map && isLoaded) {
            const geocoder = new google.maps.Geocoder()
            geocoder.geocode({ address: searchValue }, (results, status) => {
                if (
                    status === google.maps.GeocoderStatus.OK &&
                    results &&
                    results[0]
                ) {
                    const position = results[0].geometry.location.toJSON()
                    setMarkerPosition(position)
                    map.panTo(position)
                    map.setZoom(15)
                    onLocationChange(
                        results[0].formatted_address,
                        position.lat,
                        position.lng,
                    )
                } else {
                    console.warn(
                        'Geocode search was not successful for the following reason: ' + status + '. Please check your Google Maps API Key configuration.'
                    )
                }
            })
        }
    }

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng && map && isLoaded) {
            const clickedPosition = e.latLng.toJSON()
            setMarkerPosition(clickedPosition)

            const geocoder = new google.maps.Geocoder()
            geocoder.geocode(
                { location: clickedPosition },
                (results, status) => {
                    if (
                        status === google.maps.GeocoderStatus.OK &&
                        results &&
                        results[0]
                    ) {
                        const address = results[0].formatted_address
                        setSearchValue(address)
                        onLocationChange(
                            address,
                            clickedPosition.lat,
                            clickedPosition.lng,
                        )
                    } else {
                        console.warn(
                            'Geocode click was not successful for the following reason: ' + status + '. Please check your Google Maps API Key configuration.'
                        )
                        setSearchValue(
                            `${clickedPosition.lat}, ${clickedPosition.lng}`,
                        )
                        onLocationChange(
                            `${clickedPosition.lat}, ${clickedPosition.lng}`,
                            clickedPosition.lat,
                            clickedPosition.lng,
                        )
                    }
                },
            )

            map.panTo(clickedPosition)
        }
    }

    if (loadError) {
        return <div>Error loading maps</div>
    }

    if (!GOOGLE_MAPS_API_KEY) {
        return <div>Google Maps is not configured for this environment.</div>
    }

    if (!isLoaded) {
        return <div>Loading Maps...</div>
    }

    return (
        <div>
            {showInput && (
                <>
                    <Input
                        IsUsername
                        type="text"
                        value={searchValue}
                        onChange={(e: any) => {
                            setSearchValue(e.target.value)
                            // Fallback: sync raw text to parent immediately in case they don't click Search
                            onLocationChange(e.target.value, markerPosition?.lat || center.lat, markerPosition?.lng || center.lng)
                        }}
                        placeholder="Enter location"
                        name="location"
                        label="Location"
                        icon={<Search onClick={handleSearch} className="cursor-pointer text-slate-500" size={20} />}
                        style={{ marginBottom: '15px' }}
                    />
                </>
            )}
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={markerPosition || center}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={handleMapClick}
            >
                {markerPosition && (
                    <MarkerF
                        position={markerPosition}
                        icon={{
                            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                        }}
                    />
                )}
            </GoogleMap>
        </div>
    )
}

export default MapComponent
