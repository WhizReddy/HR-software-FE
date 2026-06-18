import {
    useState,
    useCallback,
    useEffect,
    useRef,
    type ChangeEvent,
} from 'react'
import {
    GoogleMap,
    useLoadScript,
    MarkerF,
    type Libraries,
} from '@react-google-maps/api'
import Input from '@/Components/Input/Index'
import { Search } from 'lucide-react'

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
    containerClassName?: string
}

const libraries: Libraries = ['places', 'marker']
const mapOptions: google.maps.MapOptions = {
    clickableIcons: false,
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    gestureHandling: 'cooperative',
}

const MapComponent: React.FC<MapComponentProps> = ({
    onLocationChange,
    savedLocation,
    showInput,
    containerClassName = 'h-full w-full',
}) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY || '',
        libraries,
    })

    const [map, setMap] = useState<MapType | null>(null)
    const [searchValue, setSearchValue] = useState('')
    const [mapMessage, setMapMessage] = useState<string | null>(null)
    const [markerPosition, setMarkerPosition] = useState<LatLngLiteral | null>(
        null,
    )
    const lastResolvedLocation = useRef('')
    const normalizedSavedLocation = savedLocation?.trim() || ''

    const onLoad = useCallback((map: MapType) => {
        setMap(map)
    }, [])

    const onUnmount = useCallback(() => {
        setMap(null)
    }, [])

    useEffect(() => {
        if (
            !normalizedSavedLocation ||
            !isLoaded ||
            normalizedSavedLocation === lastResolvedLocation.current
        ) {
            return
        }

        const geocoder = new google.maps.Geocoder()
        geocoder.geocode(
            { address: normalizedSavedLocation },
            (results, status) => {
                if (
                    status === google.maps.GeocoderStatus.OK &&
                    results &&
                    results[0]
                ) {
                    const position = results[0].geometry.location.toJSON()
                    setMarkerPosition(position)
                    setSearchValue(results[0].formatted_address)
                    lastResolvedLocation.current = normalizedSavedLocation
                    if (map) {
                        map.panTo(position)
                        map.setZoom(15)
                    }
                } else {
                    setMapMessage(
                        'Saved location could not be found on the map.',
                    )
                    console.error(
                        'Geocode was not successful for the following reason: ' +
                            status,
                    )
                }
            },
        )
    }, [normalizedSavedLocation, map, isLoaded])

    const handleSearch = () => {
        const trimmedSearch = searchValue.trim()

        if (!trimmedSearch) {
            setMapMessage('Enter a location before searching.')
            return
        }

        if (map && isLoaded) {
            setMapMessage(null)
            const geocoder = new google.maps.Geocoder()
            geocoder.geocode({ address: trimmedSearch }, (results, status) => {
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
                    setMapMessage(
                        'Location was not found. Try a more specific address.',
                    )
                    console.warn(
                        'Geocode search was not successful for the following reason: ' +
                            status +
                            '. Please check your Google Maps API Key configuration.',
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
                        setMapMessage(
                            'Exact address was not found, so coordinates were used.',
                        )
                        console.warn(
                            'Geocode click was not successful for the following reason: ' +
                                status +
                                '. Please check your Google Maps API Key configuration.',
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
        return (
            <div className={containerClassName}>
                <div className="flex h-full w-full items-center justify-center bg-slate-100 px-6 text-center text-sm text-slate-500">
                    Map could not be loaded. Check the Google Maps browser key.
                </div>
            </div>
        )
    }

    if (!GOOGLE_MAPS_API_KEY) {
        return (
            <div className={containerClassName}>
                <div className="flex h-full w-full items-center justify-center bg-slate-100 px-6 text-center text-sm text-slate-500">
                    Google Maps is not configured for this environment.
                </div>
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <div className={containerClassName}>
                <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
                    Loading map...
                </div>
            </div>
        )
    }

    return (
        <div className={showInput ? 'space-y-3' : containerClassName}>
            {showInput && (
                <div className="space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="min-w-0 flex-1">
                            <Input
                                IsUsername
                                type="text"
                                value={searchValue}
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>,
                                ) => {
                                    setSearchValue(e.target.value)
                                    // Fallback: sync raw text to parent immediately in case they don't click Search
                                    onLocationChange(
                                        e.target.value,
                                        markerPosition?.lat || center.lat,
                                        markerPosition?.lng || center.lng,
                                    )
                                }}
                                placeholder="Enter location"
                                name="location"
                                label="Location"
                                style={{ marginBottom: '15px' }}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/25 sm:mt-6"
                        >
                            <Search size={16} />
                            Search
                        </button>
                    </div>
                    {mapMessage && (
                        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                            {mapMessage}
                        </p>
                    )}
                </div>
            )}
            <GoogleMap
                mapContainerClassName={
                    showInput
                        ? 'h-[320px] w-full md:h-[360px]'
                        : 'h-full w-full'
                }
                center={markerPosition || center}
                zoom={12}
                options={mapOptions}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={handleMapClick}
            >
                {markerPosition && (
                    <MarkerF
                        position={markerPosition}
                        icon={{
                            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                        }}
                    />
                )}
            </GoogleMap>
        </div>
    )
}

export default MapComponent
