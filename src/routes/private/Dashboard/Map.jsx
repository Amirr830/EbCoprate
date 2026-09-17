import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Row, Col } from "react-bootstrap";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Tooltip,
    useMap,
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

const createMarkerIcon = (
    type
) => {
    return L.divIcon({
        className:
            "map-custom-marker-wrapper",
        html: `
            <div class="map-custom-marker ${type}">
                <div class="map-custom-marker-inner"></div>
            </div>
        `,
        iconSize: [
            44,
            54,
        ],
        iconAnchor: [
            22,
            52,
        ],
        popupAnchor: [
            0,
            -48,
        ],
    });
};

function MapController({
    locations,
}) {
    const map = useMap();

    useEffect(() => {
        if (
            !locations ||
            locations.length === 0
        ) {
            map.setView(
                mashhadCenter,
                13,
                {
                    animate: false,
                }
            );

            return;
        }

        if (
            locations.length === 1
        ) {
            map.setView(
                [
                    locations[0].lat,
                    locations[0].lng,
                ],
                16,
                {
                    animate: false,
                }
            );

            return;
        }

        const bounds =
            L.latLngBounds(
                locations.map(
                    (location) => [
                        location.lat,
                        location.lng,
                    ]
                )
            );

        map.fitBounds(
            bounds,
            {
                padding: [
                    100,
                    100,
                ],
                maxZoom: 16,
                animate: true,
                duration: 0.7,
            }
        );
    }, [
        locations,
        map,
    ]);

    return null;
}

function Map() {
    const navigate =
        useNavigate();

    const [
        mapLocations,
        setMapLocations,
    ] = useState([]);

    const [
        quickRequests,
        setQuickRequests,
    ] = useState([]);

    const [
        quickRequestOpen,
        setQuickRequestOpen,
    ] = useState(false);

    const quickRequestRef =
        useRef(null);

    const sourceIcon =
        useMemo(
            () =>
                createMarkerIcon(
                    "source"
                ),
            []
        );

    const destinationIcon =
        useMemo(
            () =>
                createMarkerIcon(
                    "destination"
                ),
            []
        );

    const loadMapLocations =
        () => {
            try {
                const savedLocations =
                    JSON.parse(
                        localStorage.getItem(
                            "selectedMapLocations"
                        ) || "[]"
                    );

                if (
                    !Array.isArray(
                        savedLocations
                    )
                ) {
                    setMapLocations(
                        []
                    );

                    return;
                }

                const validLocations =
                    savedLocations
                        .map(
                            (
                                item,
                                index
                            ) => {
                                const lat =
                                    Number(
                                        item?.lat ??
                                            item?.latitude
                                    );

                                const lng =
                                    Number(
                                        item?.lng ??
                                            item?.longitude
                                    );

                                if (
                                    !Number.isFinite(
                                        lat
                                    ) ||
                                    !Number.isFinite(
                                        lng
                                    )
                                ) {
                                    return null;
                                }

                                return {
                                    ...item,
                                    lat,
                                    lng,
                                    mapIndex:
                                        index,
                                };
                            }
                        )
                        .filter(
                            Boolean
                        );

                setMapLocations(
                    validLocations
                );
            } catch (error) {
                setMapLocations(
                    []
                );
            }
        };

    useEffect(() => {
        localStorage.removeItem(
            "selectedMapLocations"
        );

        setMapLocations([]);

        const handleLocationsUpdated =
            () => {
                loadMapLocations();
            };

        window.addEventListener(
            "selectedMapLocationsUpdated",
            handleLocationsUpdated
        );

        window.addEventListener(
            "storage",
            handleLocationsUpdated
        );

        return () => {
            window.removeEventListener(
                "selectedMapLocationsUpdated",
                handleLocationsUpdated
            );

            window.removeEventListener(
                "storage",
                handleLocationsUpdated
            );
        };
    }, []);

    useEffect(() => {
        const loadQuickRequests =
            () => {
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
                                      (
                                          item
                                      ) =>
                                          item &&
                                          typeof item ===
                                              "object" &&
                                          typeof item.name ===
                                              "string"
                                  )
                                  .map(
                                      (
                                          item
                                      ) => ({
                                          ...item,
                                          name: item.name.trim(),
                                      })
                                  )
                                  .filter(
                                      (
                                          item
                                      ) =>
                                          item.name
                                  )
                            : [];

                    setQuickRequests(
                        validRequests
                    );
                } catch (
                    error
                ) {
                    setQuickRequests(
                        []
                    );
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
        const handleOutsideClick =
            (
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

    const handleQuickRequest =
        (
            request
        ) => {
            setQuickRequestOpen(
                false
            );

            navigate(
                paths.private.definitions.RequestForm,
                {
                    state: {
                        quickRequest:
                            request,
                    },
                }
            );
        };

    const getLocationTitle =
        (
            location,
            index
        ) => {
            const type =
                String(
                    location?.addressType ||
                        ""
                )
                    .trim()
                    .toLowerCase();

            if (
                type ===
                "origin"
            ) {
                return "مبدأ";
            }

            if (
                type ===
                "destination"
            ) {
                return "مقصد";
            }

            const destinationNumber =
                type.match(
                    /destination(\d+)/
                );

            if (
                destinationNumber
            ) {
                return `مقصد ${destinationNumber[1]}`;
            }

            if (
                type.match(
                    /destination[\s_-]*(\d+)/
                )
            ) {
                return `مقصد ${
                    type.match(
                        /destination[\s_-]*(\d+)/
                    )[1]
                }`;
            }

            return `مقصد ${
                index
            }`;
        };

    const getLocationType =
        (
            location
        ) => {
            const type =
                String(
                    location?.addressType ||
                        ""
                )
                    .trim()
                    .toLowerCase();

            if (
                type ===
                "origin"
            ) {
                return "source";
            }

            return "destination";
        };

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
                                            نقاط انتخاب‌شده
                                        </label>

                                        <div className="map-search-input-wrapper">
                                            <div className="map-search-icon">
                                                <FiMapPin />
                                            </div>

                                            <div
                                                className="map-search-input"
                                                style={{
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    paddingRight:
                                                        "45px",
                                                }}
                                            >
                                                {mapLocations.length ===
                                                0
                                                    ? "هنوز مبدأ یا مقصدی انتخاب نشده است"
                                                    : `${mapLocations.length} نقطه روی نقشه نمایش داده می‌شود`}
                                            </div>
                                        </div>

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
                                                    (
                                                        previous
                                                    ) =>
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
                                zoom={
                                    13
                                }
                                minZoom={
                                    11
                                }
                                maxZoom={
                                    19
                                }
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
                                    locations={
                                        mapLocations
                                    }
                                />

                                {mapLocations.map(
                                    (
                                        location,
                                        index
                                    ) => {
                                        const markerType =
                                            getLocationType(
                                                location
                                            );

                                        const title =
                                            getLocationTitle(
                                                location,
                                                index
                                            );

                                        const icon =
                                            markerType ===
                                            "source"
                                                ? sourceIcon
                                                : destinationIcon;

                                        return (
                                            <Marker
                                                key={`${location.addressType}-${location.lat}-${location.lng}-${index}`}
                                                position={[
                                                    location.lat,
                                                    location.lng,
                                                ]}
                                                icon={
                                                    icon
                                                }
                                                draggable={
                                                    false
                                                }
                                                keyboard={
                                                    false
                                                }
                                            >

                                                <Tooltip
                                                    permanent
                                                    direction="top"
                                                    offset={[
                                                        0,
                                                        -40,
                                                    ]}
                                                    className={`map-marker-tooltip ${
                                                        markerType ===
                                                        "source"
                                                            ? "source-tooltip"
                                                            : "destination-tooltip"
                                                    }`}
                                                >
                                                    {
                                                        title
                                                    }
                                                </Tooltip>

                                                <Popup>
                                                    <div className="map-popup">

                                                        <div
                                                            className={`map-popup-title ${
                                                                markerType
                                                            }`}
                                                        >
                                                            {
                                                                title
                                                            }
                                                        </div>

                                                        <div className="map-popup-address">
                                                            {
                                                                location.fullAddress ||
                                                                location.address ||
                                                                "آدرس ثبت نشده است"
                                                            }
                                                        </div>

                                                    </div>
                                                </Popup>

                                            </Marker>
                                        );
                                    }
                                )}

                            </MapContainer>

                        </div>

                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Map;