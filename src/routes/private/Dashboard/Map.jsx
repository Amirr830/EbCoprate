import React, { useEffect, useMemo, useRef, useState } from "react";
import { Row, Col } from "react-bootstrap";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Tooltip,
    Polyline,
    useMap,
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FiChevronDown, FiClock, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import paths from "../../../app/paths.json";
import "./Css/Map.css";

const mashhadCenter = [36.3155, 59.5323];

const mashhadBounds = [
    [36.16, 59.35],
    [36.48, 59.75],
];

const createMarkerIcon = (type) => {
    return L.divIcon({
        className: "map-custom-marker-wrapper",
        html: `
            <div class="map-custom-marker ${type}">
                <div class="map-custom-marker-inner"></div>
            </div>
        `,
        iconSize: [44, 54],
        iconAnchor: [22, 52],
        popupAnchor: [0, -48],
    });
};

const createCurve = (start, end) => {
    if (!start || !end) {
        return [];
    }

    const startLat = start[0];
    const startLng = start[1];

    const endLat = end[0];
    const endLng = end[1];

    const dx = endLng - startLng;
    const dy = endLat - startLat;

    const distance = Math.sqrt(
        dx * dx + dy * dy
    );

    if (distance === 0) {
        return [start, end];
    }

    const midLat =
        (startLat + endLat) / 2;

    const midLng =
        (startLng + endLng) / 2;

    const curveAmount = Math.min(
        Math.max(distance * 0.18, 0.008),
        0.035
    );

    const perpendicularLat =
        -dx / distance;

    const perpendicularLng =
        dy / distance;

    const controlLat =
        midLat +
        perpendicularLat *
        curveAmount;

    const controlLng =
        midLng +
        perpendicularLng *
        curveAmount;

    const points = [];

    const steps = 80;

    for (
        let i = 0;
        i <= steps;
        i++
    ) {
        const t = i / steps;

        const oneMinusT = 1 - t;

        const lat =
            oneMinusT *
            oneMinusT *
            startLat +
            2 *
            oneMinusT *
            t *
            controlLat +
            t *
            t *
            endLat;

        const lng =
            oneMinusT *
            oneMinusT *
            startLng +
            2 *
            oneMinusT *
            t *
            controlLng +
            t *
            t *
            endLng;

        points.push([lat, lng]);
    }

    return points;
};

function MapController({
    source,
    destination,
    searchPosition,
}) {
    const map = useMap();

    useEffect(() => {
        if (source && destination) {
            const bounds =
                L.latLngBounds(
                    source,
                    destination
                );

            map.fitBounds(
                bounds,
                {
                    padding: [100, 100],
                    maxZoom: 15,
                    animate: true,
                    duration: 0.7,
                }
            );

            return;
        }

        if (searchPosition) {
            map.flyTo(
                searchPosition,
                16,
                {
                    duration: 0.6,
                }
            );
        }
    }, [
        source,
        destination,
        searchPosition,
        map,
    ]);

    return null;
}

function MapClickHandler({
    source,
    destination,
    onSelect,
}) {
    useMapEvents({
        click(event) {
            const position = [
                event.latlng.lat,
                event.latlng.lng,
            ];

            if (!source) {
                onSelect(
                    position,
                    "source"
                );
                return;
            }

            if (!destination) {
                onSelect(
                    position,
                    "destination"
                );
            }
        },
    });

    return null;
}

function Map() {
    const navigate = useNavigate();

    const [source, setSource] =
        useState(null);

    const [destination, setDestination] =
        useState(null);

    const [sourceAddress, setSourceAddress] =
        useState("");

    const [
        destinationAddress,
        setDestinationAddress,
    ] = useState("");

    const [searchText, setSearchText] =
        useState("");

    const [searchResults, setSearchResults] =
        useState([]);

    const [searchLoading, setSearchLoading] =
        useState(false);

    const [addressLoading, setAddressLoading] =
        useState(false);

    const [searchPosition, setSearchPosition] =
        useState(null);

    const [
        quickRequests,
        setQuickRequests,
    ] = useState([]);

    const [
        quickRequestOpen,
        setQuickRequestOpen,
    ] = useState(false);

    const searchTimerRef =
        useRef(null);

    const searchControllerRef =
        useRef(null);

    const quickRequestRef =
        useRef(null);

    const sourceIcon = useMemo(
        () =>
            createMarkerIcon(
                "source"
            ),
        []
    );

    const destinationIcon = useMemo(
        () =>
            createMarkerIcon(
                "destination"
            ),
        []
    );

    const curve = useMemo(
        () =>
            createCurve(
                source,
                destination
            ),
        [source, destination]
    );

    useEffect(() => {
        const loadQuickRequests = () => {
            try {
                const savedRequests =
                    JSON.parse(
                        localStorage.getItem(
                            "quickRequests"
                        ) || "[]"
                    );

                const validRequests =
                    Array.isArray(
                        savedRequests
                    )
                        ? savedRequests
                              .filter(
                                  (item) =>
                                      item &&
                                      typeof item ===
                                          "object" &&
                                      typeof item.name ===
                                          "string"
                              )
                              .map((item) => ({
                                  ...item,
                                  name: item.name.trim(),
                              }))
                              .filter(
                                  (item) =>
                                      item.name
                              )
                        : [];

                setQuickRequests(
                    validRequests
                );
            } catch (error) {
                setQuickRequests([]);
            }
        };

        loadQuickRequests();

        window.addEventListener(
            "quickRequestsUpdated",
            loadQuickRequests
        );

        window.addEventListener(
            "storage",
            loadQuickRequests
        );

        return () => {
            window.removeEventListener(
                "quickRequestsUpdated",
                loadQuickRequests
            );

            window.removeEventListener(
                "storage",
                loadQuickRequests
            );
        };
    }, []);

    useEffect(() => {
        const handleOutsideClick = (
            event
        ) => {
            if (
                quickRequestRef.current &&
                !quickRequestRef.current.contains(
                    event.target
                )
            ) {
                setQuickRequestOpen(
                    false
                );
            }
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    const handleQuickRequest = (
        request
    ) => {
        setQuickRequestOpen(
            false
        );

        navigate(
            paths.private.definitions.RequestForm,
            {
                state: {
                    quickRequest: request,
                },
            }
        );
    };

    const getAddress = async (
        latitude,
        longitude,
        type
    ) => {
        try {
            setAddressLoading(true);

            const response =
                await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=fa`
                );

            if (!response.ok) {
                throw new Error(
                    "Address error"
                );
            }

            const data =
                await response.json();

            const address =
                data?.display_name ||
                "آدرس دقیق یافت نشد";

            if (
                type === "source"
            ) {
                setSourceAddress(
                    address
                );
            }

            if (
                type === "destination"
            ) {
                setDestinationAddress(
                    address
                );
            }
        } catch (error) {
            if (
                type === "source"
            ) {
                setSourceAddress(
                    "آدرس این نقطه قابل دریافت نیست"
                );
            }

            if (
                type === "destination"
            ) {
                setDestinationAddress(
                    "آدرس این نقطه قابل دریافت نیست"
                );
            }
        } finally {
            setAddressLoading(false);
        }
    };

    const selectLocation = async (
        position,
        type
    ) => {
        if (
            type === "source"
        ) {
            setSource(position);

            setSourceAddress("");

            setDestination(null);

            setDestinationAddress("");

            setSearchPosition(
                position
            );

            await getAddress(
                position[0],
                position[1],
                "source"
            );

            return;
        }

        setDestination(position);

        setDestinationAddress("");

        setSearchPosition(
            position
        );

        await getAddress(
            position[0],
            position[1],
            "destination"
        );
    };

    const searchMashhad =
        async (value) => {
            const query =
                value.trim();

            if (!query) {
                setSearchResults(
                    []
                );

                setSearchLoading(
                    false
                );

                return;
            }

            if (
                searchControllerRef.current
            ) {
                searchControllerRef.current.abort();
            }

            const controller =
                new AbortController();

            searchControllerRef.current =
                controller;

            try {
                setSearchLoading(
                    true
                );

                const params =
                    new URLSearchParams();

                params.set(
                    "format",
                    "jsonv2"
                );

                params.set(
                    "q",
                    `${query}، مشهد، ایران`
                );

                params.set(
                    "limit",
                    "8"
                );

                params.set(
                    "addressdetails",
                    "1"
                );

                params.set(
                    "accept-language",
                    "fa"
                );

                params.set(
                    "countrycodes",
                    "ir"
                );

                params.set(
                    "viewbox",
                    "59.35,36.48,59.75,36.16"
                );

                params.set(
                    "bounded",
                    "1"
                );

                const response =
                    await fetch(
                        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
                        {
                            signal:
                                controller.signal,
                        }
                    );

                if (!response.ok) {
                    throw new Error(
                        "Search error"
                    );
                }

                const data =
                    await response.json();

                const results =
                    (
                        data || []
                    ).filter(
                        (item) => {
                            const lat =
                                Number(
                                    item.lat
                                );

                            const lng =
                                Number(
                                    item.lon
                                );

                            return (
                                lat >=
                                    mashhadBounds[0][0] &&
                                lat <=
                                    mashhadBounds[1][0] &&
                                lng >=
                                    mashhadBounds[0][1] &&
                                lng <=
                                    mashhadBounds[1][1]
                            );
                        }
                    );

                setSearchResults(
                    results
                );
            } catch (error) {
                if (
                    error.name !==
                    "AbortError"
                ) {
                    setSearchResults(
                        []
                    );
                }
            } finally {
                if (
                    !controller.signal
                        .aborted
                ) {
                    setSearchLoading(
                        false
                    );
                }
            }
        };

    const handleSearchChange = (
        event
    ) => {
        const value =
            event.target.value;

        setSearchText(value);

        if (
            searchTimerRef.current
        ) {
            clearTimeout(
                searchTimerRef.current
            );
        }

        if (
            searchControllerRef.current
        ) {
            searchControllerRef.current.abort();
        }

        if (!value.trim()) {
            setSearchResults(
                []
            );

            setSearchLoading(
                false
            );

            return;
        }

        setSearchLoading(true);

        searchTimerRef.current =
            setTimeout(() => {
                searchMashhad(
                    value
                );
            }, 2000);
    };

    const handleSearchResult =
        async (result) => {
            const position = [
                Number(result.lat),
                Number(result.lon),
            ];

            setSearchResults([]);

            setSearchText(
                result.name ||
                    result.address
                        ?.road ||
                    result.display_name ||
                    ""
            );

            setSearchPosition(
                position
            );

            if (!source) {
                await selectLocation(
                    position,
                    "source"
                );

                return;
            }

            if (!destination) {
                await selectLocation(
                    position,
                    "destination"
                );

                return;
            }

            await selectLocation(
                position,
                "destination"
            );
        };

    const handleSourceDrag = async (
        event
    ) => {
        const latLng =
            event.target.getLatLng();

        const position = [
            latLng.lat,
            latLng.lng,
        ];

        setSource(position);

        setSourceAddress("");

        setSearchPosition(
            position
        );

        await getAddress(
            latLng.lat,
            latLng.lng,
            "source"
        );
    };

    const handleDestinationDrag =
        async (event) => {
            const latLng =
                event.target.getLatLng();

            const position = [
                latLng.lat,
                latLng.lng,
            ];

            setDestination(
                position
            );

            setDestinationAddress(
                ""
            );

            setSearchPosition(
                position
            );

            await getAddress(
                latLng.lat,
                latLng.lng,
                "destination"
            );
        };

    const resetMap = () => {
        if (
            searchTimerRef.current
        ) {
            clearTimeout(
                searchTimerRef.current
            );
        }

        if (
            searchControllerRef.current
        ) {
            searchControllerRef.current.abort();
        }

        setSource(null);

        setDestination(null);

        setSourceAddress("");

        setDestinationAddress("");

        setSearchText("");

        setSearchResults([]);

        setSearchPosition(null);

        setSearchLoading(false);
    };

    useEffect(() => {
        return () => {
            if (
                searchTimerRef.current
            ) {
                clearTimeout(
                    searchTimerRef.current
                );
            }

            if (
                searchControllerRef.current
            ) {
                searchControllerRef.current.abort();
            }
        };
    }, []);

    return (
        <div className="map-page">
            <Row className="g-0">
                <Col xs={12}>
                    <div className="map-card">

                        <div className="map-top-section">

                            <Row className="g-3 align-items-center">

                                <Col
                                    xs={12}
                                    lg={8}
                                >
                                    <div className="map-search-box">

                                        <label className="map-section-label">
                                            جستجوی خیابان
                                        </label>

                                        <div className="map-search-input-wrapper">

                                            <div className="map-search-icon">
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <circle
                                                        cx="11"
                                                        cy="11"
                                                        r="6.5"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                    />

                                                    <path
                                                        d="M16 16L21 21"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                            </div>

                                            <input
                                                type="text"
                                                value={
                                                    searchText
                                                }
                                                onChange={
                                                    handleSearchChange
                                                }
                                                className="map-search-input"
                                                placeholder="مثلاً سیدرضی، خیام، وکیل‌آباد..."
                                            />

                                            {searchLoading && (
                                                <div className="map-search-loading">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            )}

                                            {searchText &&
                                                !searchLoading && (
                                                    <button
                                                        type="button"
                                                        className="map-search-clear"
                                                        onClick={() => {
                                                            setSearchText(
                                                                ""
                                                            );

                                                            setSearchResults(
                                                                []
                                                            );
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                )}

                                        </div>

                                        {searchResults.length >
                                            0 && (
                                                <div className="map-results">

                                                    <div className="map-results-top">
                                                        <span>
                                                            نتایج جستجو در مشهد
                                                        </span>

                                                        <span>
                                                            {
                                                                searchResults.length
                                                            } مورد
                                                        </span>
                                                    </div>

                                                    {searchResults.map(
                                                        (
                                                            result,
                                                            index
                                                        ) => (
                                                            <button
                                                                type="button"
                                                                className="map-result-item"
                                                                key={`${result.place_id}-${index}`}
                                                                onClick={() =>
                                                                    handleSearchResult(
                                                                        result
                                                                    )
                                                                }
                                                            >

                                                                <div className="map-result-pin">
                                                                    <svg
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                    >
                                                                        <path
                                                                            d="M12 21C15.5 16.8 18 14 18 10.5C18 7.2 15.3 4.5 12 4.5C8.7 4.5 6 7.2 6 10.5C6 14 8.5 16.8 12 21Z"
                                                                            stroke="currentColor"
                                                                            strokeWidth="1.7"
                                                                        />

                                                                        <circle
                                                                            cx="12"
                                                                            cy="10.5"
                                                                            r="2.2"
                                                                            stroke="currentColor"
                                                                            strokeWidth="1.7"
                                                                        />
                                                                    </svg>
                                                                </div>

                                                                <div className="map-result-text">

                                                                    <div className="map-result-name">
                                                                        {result.name ||
                                                                            result.address?.road ||
                                                                            "مکان انتخاب‌شده"}
                                                                    </div>

                                                                    <div className="map-result-address">
                                                                        {
                                                                            result.display_name
                                                                        }
                                                                    </div>

                                                                </div>

                                                                <div className="map-result-go">
                                                                    ←
                                                                </div>

                                                            </button>
                                                        )
                                                    )}

                                                </div>
                                            )}

                                    </div>
                                </Col>

                                <Col
                                    xs={12}
                                    lg={4}
                                >
                                    <div
                                        className="map-quick-request"
                                        ref={
                                            quickRequestRef
                                        }
                                    >

                                        <label className="map-section-label">
                                            درخواست سریع
                                        </label>

                                        <button
                                            type="button"
                                            className={`map-quick-request-button ${
                                                quickRequestOpen
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setQuickRequestOpen(
                                                    (previous) =>
                                                        !previous
                                                )
                                            }
                                        >

                                            <div className="map-quick-request-icon">
                                                <FiClock />
                                            </div>

                                            <div className="map-quick-request-content">
                                                <span className="map-quick-request-label">
                                                    درخواست سریع
                                                </span>
                                            </div>

                                            <FiChevronDown
                                                className={`map-quick-request-chevron ${
                                                    quickRequestOpen
                                                        ? "open"
                                                        : ""
                                                }`}
                                            />

                                        </button>

                                        {quickRequestOpen && (
                                            <div className="map-quick-request-dropdown">

                                                <div className="map-quick-request-list">

                                                    {quickRequests.length ===
                                                        0 ? (
                                                        <div className="map-quick-request-empty">

                                                            <div className="map-quick-request-empty-icon">
                                                                <FiClock />
                                                            </div>

                                                            <div className="map-quick-request-empty-title">
                                                                درخواست سریعی وجود ندارد
                                                            </div>

                                                            <div className="map-quick-request-empty-text">
                                                                هنوز هیچ درخواست سریعی ذخیره نکرده‌اید
                                                            </div>

                                                        </div>
                                                    ) : (
                                                        quickRequests.map(
                                                            (
                                                                request,
                                                                index
                                                            ) => (
                                                                <button
                                                                    type="button"
                                                                    className="map-quick-request-item"
                                                                    key={
                                                                        request.id ||
                                                                        `${request.name}-${index}`
                                                                    }
                                                                    onClick={() =>
                                                                        handleQuickRequest(
                                                                            request
                                                                        )
                                                                    }
                                                                >

                                                                    <div className="map-quick-request-item-number">
                                                                        {String(
                                                                            index +
                                                                                1
                                                                        ).padStart(
                                                                            2,
                                                                            "0"
                                                                        )}
                                                                    </div>

                                                                    <div className="map-quick-request-item-icon">
                                                                        <FiMapPin />
                                                                    </div>

                                                                    <div className="map-quick-request-item-content">
                                                                        <span className="map-quick-request-item-name">
                                                                            {
                                                                                request.name
                                                                            }
                                                                        </span>

                                                                        <span className="map-quick-request-item-description">
                                                                            استفاده از درخواست ذخیره‌شده
                                                                        </span>
                                                                    </div>

                                                                    <div className="map-quick-request-item-arrow">
                                                                        ←
                                                                    </div>

                                                                </button>
                                                            )
                                                        )
                                                    )}

                                                </div>

                                            </div>
                                        )}

                                    </div>
                                </Col>

                            </Row>

                        </div>

                        <div className="map-wrapper">

                            <MapContainer
                                center={
                                    mashhadCenter
                                }
                                zoom={13}
                                minZoom={11}
                                maxZoom={19}
                                maxBounds={
                                    mashhadBounds
                                }
                                maxBoundsViscosity={
                                    0.8
                                }
                                scrollWheelZoom={
                                    true
                                }
                                className="map-container"
                            >

                                <TileLayer
                                    attribution="&copy; OpenStreetMap contributors"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <MapController
                                    source={
                                        source
                                    }
                                    destination={
                                        destination
                                    }
                                    searchPosition={
                                        searchPosition
                                    }
                                />

                                <MapClickHandler
                                    source={
                                        source
                                    }
                                    destination={
                                        destination
                                    }
                                    onSelect={
                                        selectLocation
                                    }
                                />

                                {source && (
                                    <Marker
                                        position={
                                            source
                                        }
                                        icon={
                                            sourceIcon
                                        }
                                        draggable={
                                            true
                                        }
                                        eventHandlers={{
                                            dragend:
                                                handleSourceDrag,
                                        }}
                                    >

                                        <Tooltip
                                            permanent
                                            direction="top"
                                            offset={[
                                                0,
                                                -40,
                                            ]}
                                            className="map-marker-tooltip source-tooltip"
                                        >
                                            مبدأ
                                        </Tooltip>

                                        <Popup>
                                            <div className="map-popup">

                                                <div className="map-popup-title source">
                                                    مبدأ
                                                </div>

                                                <div className="map-popup-address">
                                                    {sourceAddress ||
                                                        "در حال دریافت آدرس..."}
                                                </div>

                                            </div>
                                        </Popup>

                                    </Marker>
                                )}

                                {destination && (
                                    <Marker
                                        position={
                                            destination
                                        }
                                        icon={
                                            destinationIcon
                                        }
                                        draggable={
                                            true
                                        }
                                        eventHandlers={{
                                            dragend:
                                                handleDestinationDrag,
                                        }}
                                    >

                                        <Tooltip
                                            permanent
                                            direction="top"
                                            offset={[
                                                0,
                                                -40,
                                            ]}
                                            className="map-marker-tooltip destination-tooltip"
                                        >
                                            مقصد
                                        </Tooltip>

                                        <Popup>
                                            <div className="map-popup">

                                                <div className="map-popup-title destination">
                                                    مقصد
                                                </div>

                                                <div className="map-popup-address">
                                                    {destinationAddress ||
                                                        "در حال دریافت آدرس..."}
                                                </div>

                                            </div>
                                        </Popup>

                                    </Marker>
                                )}

                                {curve.length >
                                    1 && (
                                    <>
                                        <Polyline
                                            positions={
                                                curve
                                            }
                                            pathOptions={{
                                                color: "#ffffff",
                                                weight: 9,
                                                opacity: 0.95,
                                                lineCap: "round",
                                                lineJoin: "round",
                                            }}
                                        />

                                        <Polyline
                                            positions={
                                                curve
                                            }
                                            pathOptions={{
                                                color: "#273444",
                                                weight: 5,
                                                opacity: 0.95,
                                                lineCap: "round",
                                                lineJoin: "round",
                                            }}
                                        />

                                        <Polyline
                                            positions={
                                                curve
                                            }
                                            pathOptions={{
                                                color: "#f26b38",
                                                weight: 3,
                                                opacity: 1,
                                                lineCap: "round",
                                                lineJoin: "round",
                                            }}
                                        />
                                    </>
                                )}

                            </MapContainer>

                            {!source && (
                                <div className="map-guide">

                                    <div className="map-guide-marker source">
                                        <span></span>
                                    </div>

                                    <div>
                                        <div className="map-guide-title">
                                            انتخاب مبدأ
                                        </div>

                                        <div className="map-guide-text">
                                            روی نقشه کلیک کنید یا خیابان موردنظر را جستجو کنید
                                        </div>
                                    </div>

                                </div>
                            )}

                            {source &&
                                !destination && (
                                    <div className="map-guide">

                                        <div className="map-guide-marker destination">
                                            <span></span>
                                        </div>

                                        <div>
                                            <div className="map-guide-title">
                                                انتخاب مقصد
                                            </div>

                                            <div className="map-guide-text">
                                                حالا مقصد را روی نقشه یا از جستجو انتخاب کنید
                                            </div>
                                        </div>

                                    </div>
                                )}

                            {(source ||
                                destination) && (
                                <button
                                    type="button"
                                    className="map-reset-button btn btn-primary btn-sm"
                                    onClick={
                                        resetMap
                                    }
                                >
                                    انتخاب مجدد
                                </button>
                            )}

                        </div>

                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Map;