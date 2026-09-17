import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { Modal } from "react-bootstrap";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../Css/NewDestinationModal.css";
import {
  FaTimes,
  FaChevronDown,
  FaSearch,
  FaExclamationTriangle,
} from "react-icons/fa";
import strings from "../../../../app/String.json";

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MASHHAD_CENTER = [36.2972, 59.6067];

const CITY_OPTIONS = [
  {
    city: "مشهد",
    province: "خراسان رضوی",
    center: [36.2972, 59.6067],
  },
  {
    city: "تهران",
    province: "تهران",
    center: [35.6892, 51.389],
  },
  {
    city: "تبریز",
    province: "آذربایجان شرقی",
    center: [38.0962, 46.2738],
  },
  {
    city: "ارومیه",
    province: "آذربایجان غربی",
    center: [37.5527, 45.0761],
  },
  {
    city: "اردبیل",
    province: "اردبیل",
    center: [38.2498, 48.2933],
  },
  {
    city: "اصفهان",
    province: "اصفهان",
    center: [32.6546, 51.668],
  },
  {
    city: "کرج",
    province: "البرز",
    center: [35.84, 50.9391],
  },
  {
    city: "ایلام",
    province: "ایلام",
    center: [33.6374, 46.4227],
  },
  {
    city: "بوشهر",
    province: "بوشهر",
    center: [28.9234, 50.8203],
  },
  {
    city: "شهرکرد",
    province: "چهارمحال و بختیاری",
    center: [32.3256, 50.8644],
  },
  {
    city: "بیرجند",
    province: "خراسان جنوبی",
    center: [32.8663, 59.2211],
  },
  {
    city: "بجنورد",
    province: "خراسان شمالی",
    center: [37.475, 57.333],
  },
  {
    city: "اهواز",
    province: "خوزستان",
    center: [31.3183, 48.6706],
  },
  {
    city: "زنجان",
    province: "زنجان",
    center: [36.6736, 48.4787],
  },
  {
    city: "سمنان",
    province: "سمنان",
    center: [35.5729, 53.3971],
  },
  {
    city: "زاهدان",
    province: "سیستان و بلوچستان",
    center: [29.4963, 60.8629],
  },
  {
    city: "شیراز",
    province: "فارس",
    center: [29.5918, 52.5837],
  },
  {
    city: "قزوین",
    province: "قزوین",
    center: [36.2688, 50.0041],
  },
  {
    city: "قم",
    province: "قم",
    center: [34.6416, 50.8746],
  },
  {
    city: "سنندج",
    province: "کردستان",
    center: [35.3149, 46.9988],
  },
  {
    city: "کرمان",
    province: "کرمان",
    center: [30.2839, 57.0834],
  },
  {
    city: "کرمانشاه",
    province: "کرمانشاه",
    center: [34.3142, 47.065],
  },
  {
    city: "یاسوج",
    province: "کهگیلویه و بویراحمد",
    center: [30.6682, 51.588],
  },
  {
    city: "گرگان",
    province: "گلستان",
    center: [36.8456, 54.4393],
  },
  {
    city: "رشت",
    province: "گیلان",
    center: [37.2808, 49.5832],
  },
  {
    city: "خرم‌آباد",
    province: "لرستان",
    center: [33.4878, 48.3558],
  },
  {
    city: "ساری",
    province: "مازندران",
    center: [36.5659, 53.0586],
  },
  {
    city: "اراک",
    province: "مرکزی",
    center: [34.0917, 49.6892],
  },
  {
    city: "بندرعباس",
    province: "هرمزگان",
    center: [27.1832, 56.2666],
  },
  {
    city: "همدان",
    province: "همدان",
    center: [34.798, 48.5148],
  },
  {
    city: "یزد",
    province: "یزد",
    center: [31.8974, 54.3569],
  },
];

const DEFAULT_CITY =
  CITY_OPTIONS.find(
    (item) => item.city === "مشهد"
  ) || {
    city: "مشهد",
    province: "خراسان رضوی",
    center: MASHHAD_CENTER,
  };

function MapController({
  selectedPosition,
  selectedCity,
}) {
  const map = useMap();

  useEffect(() => {
    let frameOne;
    let frameTwo;

    frameOne = requestAnimationFrame(() => {
      map.invalidateSize({
        pan: false,
        animate: false,
      });

      frameTwo = requestAnimationFrame(() => {
        map.invalidateSize({
          pan: false,
          animate: false,
        });

        if (selectedPosition) {
          map.setView(
            selectedPosition,
            17,
            {
              animate: false,
            }
          );
        } else {
          map.setView(
            selectedCity.center,
            13,
            {
              animate: false,
            }
          );
        }
      });
    });

    return () => {
      cancelAnimationFrame(
        frameOne
      );

      cancelAnimationFrame(
        frameTwo
      );
    };
  }, [
    map,
    selectedPosition,
    selectedCity,
  ]);

  return null;
}

function MapClickHandler({
  onMapClick,
}) {
  useMapEvents({
    click: (event) => {
      onMapClick(event);
    },
  });

  return null;
}

export default function NewDestinationModal(
  props
) {
  const {
    addressType = "destination",
    onAddressSubmit,
    children,
    isOpen = false,
    onClose,
    initialData = null,
  } = props;

  const isControlled =
    Object.prototype.hasOwnProperty.call(
      props,
      "isOpen"
    );

  const [internalShow, setInternalShow] =
    useState(false);

  const show = isControlled
    ? isOpen
    : internalShow;

  const [step, setStep] =
    useState(1);

  const [search, setSearch] =
    useState("");

  const [
    searchResults,
    setSearchResults,
  ] = useState([]);

  const [
    searchLoading,
    setSearchLoading,
  ] = useState(false);

  const [
    showResults,
    setShowResults,
  ] = useState(false);

  const [
    selectedPosition,
    setSelectedPosition,
  ] = useState(null);

  const [
    selectedAddress,
    setSelectedAddress,
  ] = useState("");

  const [
    selectedCity,
    setSelectedCity,
  ] = useState(DEFAULT_CITY);

  const [
    showCityDropdown,
    setShowCityDropdown,
  ] = useState(false);

  const [
    citySearch,
    setCitySearch,
  ] = useState("");

  const [
    alertMessage,
    setAlertMessage,
  ] = useState("");

  const [
    showAlert,
    setShowAlert,
  ] = useState(false);

  const cityDropdownRef =
    useRef(null);

  const emptyAddress = {
    address: "",
    phone: "",
    floor: "",
    description: "",
  };

  const [formData, setFormData] =
    useState({
      address: "",
      phone: "",
      floor: "",
      description: "",
    });

  const isOrigin =
    addressType === "origin";

  const locationTitle =
    isOrigin
      ? strings.origin
      : strings.destination;

  const locationReceiveText =
    isOrigin
      ? strings.newDestinationModal.originInformation
      : strings.newDestinationModal.destinationInformation;

  const locationDescription =
    strings.newDestinationModal.locationDescriptionPlaceholder;

  const showFormAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  useEffect(() => {
    const handleOutsideClick =
      (event) => {
        if (
          cityDropdownRef.current &&
          !cityDropdownRef.current.contains(
            event.target
          )
        ) {
          setShowCityDropdown(
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

  const resetModal = (
    data = null
  ) => {
    const source =
      data && typeof data === "object"
        ? data
        : null;

    const sourceLat =
      source?.lat ??
      source?.latitude ??
      null;

    const sourceLng =
      source?.lng ??
      source?.longitude ??
      null;

    const hasPosition =
      sourceLat !== null &&
      sourceLng !== null &&
      sourceLat !== "" &&
      sourceLng !== "";

    const position =
      hasPosition
        ? [
            Number(sourceLat),
            Number(sourceLng),
          ]
        : null;

    const sourceAddress =
      source?.address ||
      source?.fullAddress ||
      "";

    const sourceFullAddress =
      source?.fullAddress ||
      source?.address ||
      "";

    const city =
      CITY_OPTIONS.find(
        (item) =>
          item.city === source?.city &&
          item.province ===
            source?.province
      ) || DEFAULT_CITY;

    setStep(1);
    setSearch(
      sourceAddress
    );
    setSearchResults([]);
    setShowResults(false);
    setSearchLoading(false);
    setSelectedPosition(
      position
    );
    setSelectedAddress(
      sourceFullAddress
    );
    setShowAlert(false);
    setAlertMessage("");
    setShowCityDropdown(false);
    setCitySearch("");
    setSelectedCity(city);

    setFormData({
      address:
        sourceAddress,
      phone:
        source?.phone || "",
      floor:
        source?.floor || "",
      description:
        source?.description || "",
    });
  };

  const handleShow = (
    event
  ) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    resetModal(
      initialData
    );

    if (!isControlled) {
      setInternalShow(true);
    }
  };

  const handleClose = () => {
    if (!isControlled) {
      setInternalShow(false);
    }

    if (onClose) {
      onClose();
    }

    setTimeout(() => {
      resetModal();
    }, 0);
  };

  const handleInputChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setFormData(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );
  };

  const handleNumericInputChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    const numericValue =
      value.replace(/\D/g, "");

    setFormData(
      (prev) => ({
        ...prev,
        [name]: numericValue,
      })
    );
  };

  const handleCityChange = (
    city
  ) => {
    setSelectedCity(city);
    setShowCityDropdown(
      false
    );
    setCitySearch("");
    setSearch("");
    setSearchResults([]);
    setShowResults(false);
    setSelectedPosition(null);
    setSelectedAddress("");

    setFormData(
      (prev) => ({
        ...prev,
        address: "",
      })
    );
  };

  const filteredCities =
    CITY_OPTIONS.filter(
      (item) => {
        const searchValue =
          citySearch
            .trim()
            .toLowerCase();

        if (!searchValue) {
          return true;
        }

        return (
          item.city
            .toLowerCase()
            .includes(searchValue) ||
          item.province
            .toLowerCase()
            .includes(searchValue)
        );
      }
    );

  const updateAddressFromMap = (
    data,
    position
  ) => {
    if (!data) {
      return;
    }

    const address =
      data.address || {};

    const street =
      address.road ||
      address.pedestrian ||
      address.residential ||
      address.neighbourhood ||
      "";

    setSelectedPosition(
      position
    );

    setSelectedAddress(
      street
    );

    setSearch(
      street || ""
    );

    setFormData(
      (prev) => ({
        ...prev,
        address:
          street ||
          "",
      })
    );
  };

  const handleMarkerDragEnd =
    async (event) => {
      const {
        lat,
        lng,
      } =
        event.target.getLatLng();

      const newPosition = [
        lat,
        lng,
      ];

      setSelectedPosition(
        newPosition
      );

      try {
        const url =
          "https://nominatim.openstreetmap.org/reverse" +
          "?format=jsonv2" +
          "&addressdetails=1" +
          "&accept-language=fa" +
          "&lat=" +
          lat +
          "&lon=" +
          lng;

        const response =
          await fetch(url, {
            headers: {
              Accept:
                "application/json",
            },
          });

        if (!response.ok) {
          throw new Error(
            strings.newDestinationModal.reverseGeocodingFailed
          );
        }

        const data =
          await response.json();

        updateAddressFromMap(
          data,
          newPosition
        );
      } catch (error) {
        console.error(
          "Reverse Address Error:",
          error
        );
      }
    };

  useEffect(() => {
    if (
      !show ||
      step !== 1
    ) {
      return;
    }

    const value =
      search.trim();

    if (value.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timeout =
      setTimeout(
        async () => {
          try {
            setSearchLoading(
              true
            );

            const query =
              `${value}, ${selectedCity.city}, ${selectedCity.province}, ایران`;

            const url =
              "https://nominatim.openstreetmap.org/search" +
              "?format=jsonv2" +
              "&addressdetails=1" +
              "&limit=8" +
              "&countrycodes=ir" +
              "&accept-language=fa" +
              "&q=" +
              encodeURIComponent(
                query
              );

            const response =
              await fetch(
                url,
                {
                  headers: {
                    Accept:
                      "application/json",
                  },
                }
              );

            if (!response.ok) {
              throw new Error(
                strings.newDestinationModal.addressSearchFailed
              );
            }

            const data =
              await response.json();

            setSearchResults(
              data || []
            );

            setShowResults(
              true
            );
          } catch (error) {
            setSearchResults(
              []
            );

            setShowResults(
              true
            );
          } finally {
            setSearchLoading(
              false
            );
          }
        },
        500
      );

    return () =>
      clearTimeout(timeout);
  }, [
    search,
    show,
    step,
    selectedCity,
  ]);

  const handleSelectResult =
    (result) => {
      const lat =
        Number(result.lat);

      const lon =
        Number(result.lon);

      const position = [
        lat,
        lon,
      ];

      const address =
        result.address || {};

      const street =
        address.road ||
        address.pedestrian ||
        address.residential ||
        address.neighbourhood ||
        result.name ||
        "";

      setSelectedPosition(
        position
      );

      setSelectedAddress(
        street
      );

      setSearch(
        street
      );

      setFormData(
        (prev) => ({
          ...prev,
          address: street,
        })
      );

      setShowResults(
        false
      );
    };

  const handleMapClick =
    async (event) => {
      const lat =
        event.latlng.lat;

      const lon =
        event.latlng.lng;

      const position = [
        lat,
        lon,
      ];

      setSelectedPosition(
        position
      );

      try {
        const url =
          "https://nominatim.openstreetmap.org/reverse" +
          "?format=jsonv2" +
          "&addressdetails=1" +
          "&accept-language=fa" +
          "&lat=" +
          lat +
          "&lon=" +
          lon;

        const response =
          await fetch(url, {
            headers: {
              Accept:
                "application/json",
            },
          });

        if (!response.ok) {
          throw new Error(
            strings.newDestinationModal.reverseGeocodingFailed
          );
        }

        const data =
          await response.json();

        updateAddressFromMap(
          data,
          position
        );
      } catch (error) {
        console.error(
          "Reverse Address Error:",
          error
        );
      }
    };

  const handleNextStep =
    () => {
      if (!selectedPosition) {
        showFormAlert(
          strings.newDestinationModal.selectLocationOnMap.replace(
            "{location}",
            locationTitle
          )
        );

        return;
      }

      setStep(2);
    };

  const handlePreviousStep =
    () => {
      setStep(1);
    };

  const handleSubmit = (
    e
  ) => {
    e.preventDefault();

    if (!selectedPosition) {
      showFormAlert(
        strings.newDestinationModal.selectLocation.replace(
          "{location}",
          locationTitle
        )
      );

      return;
    }

    const isAddressEmpty =
      !formData.address.trim();

    const isPhoneEmpty =
      !formData.phone.trim();

    if (
      isAddressEmpty &&
      isPhoneEmpty
    ) {
      showFormAlert(
        strings.newDestinationModal.addressAndPhoneRequired
      );

      return;
    }

    if (isAddressEmpty) {
      showFormAlert(
        strings.newDestinationModal.addressRequired
      );

      return;
    }

    if (isPhoneEmpty) {
      showFormAlert(
        strings.newDestinationModal.phoneNumberRequired
      );

      return;
    }

    const finalAddress = {
      ...formData,
      latitude:
        selectedPosition?.[0] || null,
      longitude:
        selectedPosition?.[1] || null,
      lat:
        selectedPosition?.[0] || null,
      lng:
        selectedPosition?.[1] || null,
      fullAddress:
        selectedAddress ||
        formData.address ||
        "",
      city: selectedCity.city,
      province: selectedCity.province,
    };

    if (onAddressSubmit) {
      onAddressSubmit({
        addressType,
        address: finalAddress,
        lat: finalAddress.lat,
        lng: finalAddress.lng,
        latitude:
          finalAddress.latitude,
        longitude:
          finalAddress.longitude,
      });
    }

    try {
      const savedMapLocations =
        JSON.parse(
          localStorage.getItem(
            "selectedMapLocations"
          ) || "[]"
        );

      const validLocations =
        Array.isArray(
          savedMapLocations
        )
          ? savedMapLocations
          : [];

      const newLocation = {
        addressType,
        address:
          finalAddress.address,
        fullAddress:
          finalAddress.fullAddress,
        latitude:
          finalAddress.latitude,
        longitude:
          finalAddress.longitude,
        lat:
          finalAddress.lat,
        lng:
          finalAddress.lng,
        city:
          finalAddress.city,
        province:
          finalAddress.province,
      };

      const normalizedType =
        String(
          addressType || ""
        )
          .trim()
          .toLowerCase();

      let updatedLocations;

      if (
        normalizedType ===
        "origin"
      ) {
        updatedLocations =
          validLocations.filter(
            (item) =>
              String(
                item?.addressType || ""
              )
                .trim()
                .toLowerCase() !==
              "origin"
          );

        updatedLocations.unshift(
          newLocation
        );
      } else {
        const existingIndex =
          validLocations.findIndex(
            (item) =>
              String(
                item?.addressType || ""
              )
                .trim()
                .toLowerCase() ===
              normalizedType
          );

        if (
          existingIndex >= 0
        ) {
          updatedLocations = [
            ...validLocations,
          ];

          updatedLocations[
            existingIndex
          ] = newLocation;
        } else {
          updatedLocations = [
            ...validLocations,
            newLocation,
          ];
        }
      }

      localStorage.setItem(
        "selectedMapLocations",
        JSON.stringify(
          updatedLocations
        )
      );

      window.dispatchEvent(
        new CustomEvent(
          "selectedMapLocationsUpdated",
          {
            detail:
              updatedLocations,
          }
        )
      );
    } catch (error) {
      console.error(
        "Map Location Save Error:",
        error
      );
    }

    handleClose();
  };

  let newFirstChild =
    null;

  if (children) {
    const child =
      Array.isArray(children)
        ? children[0]
        : children;

    const originalOnClick =
      child?.props?.onClick;

    newFirstChild =
      React.cloneElement(
        child,
        {
          onClick: (
            event
          ) => {
            if (
              originalOnClick
            ) {
              originalOnClick(
                event
              );
            }

            handleShow(event);
          },
        }
      );
  }

  const previousIsOpen =
    useRef(false);

  useEffect(() => {
    if (
      isControlled &&
      isOpen &&
      !previousIsOpen.current
    ) {
      resetModal(
        initialData
      );
    }

    previousIsOpen.current =
      isOpen;
  }, [
    isOpen,
    isControlled,
  ]);

  return (
    <>
      {newFirstChild}

      <Modal
        show={show}
        onHide={handleClose}
        centered
        size="lg"
        backdrop="static"
        keyboard={false}
        className="add-address-modal"
      >
        <Modal.Body
          className="add-address-modal-body"
          dir="rtl"
        >
          {showAlert && (
            <div className="address-top-alert">
              <div className="address-top-alert-icon">
                <FaExclamationTriangle />
              </div>

              <div className="address-top-alert-content">
                <p>
                  {
                    strings.newDestinationModal.incompleteInformation
                  }
                </p>

                <span>
                  {alertMessage}
                </span>
              </div>

              <button
                type="button"
                className="address-top-alert-close"
                onClick={() =>
                  setShowAlert(
                    false
                  )
                }
              >
                <FaTimes />
              </button>
            </div>
          )}

          <div className="address-modal-header">
            <button
              type="button"
              className="address-close-btn btn btn-danger"
              onClick={
                handleClose
              }
            >
              <FaTimes />
            </button>

            <div className="address-header-title">
              <div>
                <h5>
                  {step === 1
                    ? isOrigin
                      ? strings.newDestinationModal.selectOriginLocation
                      : strings.newDestinationModal.selectDestinationLocation
                    : isOrigin
                      ? strings.newDestinationModal.completeOriginAddress
                      : strings.newDestinationModal.completeDestinationAddress}
                </h5>

                <span>
                  {step === 1
                    ? isOrigin
                      ? strings.newDestinationModal.selectOriginLocationDescription
                      : strings.newDestinationModal.selectDestinationLocationDescription
                    : isOrigin
                      ? strings.newDestinationModal.completeOriginAddressDescription
                      : strings.newDestinationModal.completeDestinationAddressDescription}
                </span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="address-step-one">
              <div className="address-search-wrapper">
                <div className="row g-2 align-items-center">
                  <div className="col-3">
                    <div
                      className="city-selector-wrapper"
                      ref={
                        cityDropdownRef
                      }
                    >
                      <button
                        type="button"
                        className={`city-selector-btn ${
                          showCityDropdown
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setShowCityDropdown(
                            (prev) =>
                              !prev
                          )
                        }
                      >
                        <div className="city-selector-content">
                          <span className="city-selector-label mt-2 fs-6">
                            {
                              strings.newDestinationModal.city
                            }
                          </span>

                          <p>
                            {
                              selectedCity.city
                            }
                          </p>
                        </div>

                        <FaChevronDown
                          className={`city-selector-arrow ${
                            showCityDropdown
                              ? "rotate"
                              : ""
                          }`}
                        />
                      </button>

                      {showCityDropdown && (
                        <div className="city-dropdown">
                          <div className="city-dropdown-header">
                            <p>
                              {
                                strings.newDestinationModal.selectCity
                              }
                            </p>
                          </div>

                          <div className="city-dropdown-search">
                            <FaSearch />

                            <input
                              type="text"
                              value={
                                citySearch
                              }
                              onChange={(
                                e
                              ) =>
                                setCitySearch(
                                  e.target.value
                                )
                              }
                              placeholder={
                                strings.newDestinationModal.searchCityOrProvince
                              }
                              autoFocus
                            />
                          </div>

                          <div className="city-dropdown-list">
                            {filteredCities.length >
                            0 ? (
                              filteredCities.map(
                                (
                                  item
                                ) => {
                                  const isSelected =
                                    item.city ===
                                      selectedCity.city &&
                                    item.province ===
                                      selectedCity.province;

                                  return (
                                    <button
                                      key={
                                        item.province
                                      }
                                      type="button"
                                      className={`city-option ${
                                        isSelected
                                          ? "selected"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleCityChange(
                                          item
                                        )
                                      }
                                    >
                                      <div className="city-option-icon">
                                        <span>
                                          ●
                                        </span>
                                      </div>

                                      <div className="city-option-text">
                                        <p>
                                          {
                                            item.city
                                          }
                                        </p>

                                        <small>
                                          استان{" "}
                                          {
                                            item.province
                                          }
                                        </small>
                                      </div>

                                      {isSelected && (
                                        <div className="city-option-check">
                                          ✓
                                        </div>
                                      )}
                                    </button>
                                  );
                                }
                              )
                            ) : (
                              <div className="city-no-result">
                                <FaSearch />

                                <span>
                                  {
                                    strings.newDestinationModal.cityNotFound
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-9">
                    <div className="address-search-box">
                      <div className="search-icon">
                        <FaSearch />
                      </div>

                      <input
                        type="text"
                        className="address-search-input"
                        value={search}
                        onChange={(
                          e
                        ) => {
                          setSearch(
                            e.target.value
                          );
                        }}
                        onFocus={() => {
                          if (
                            searchResults.length >
                            0
                          ) {
                            setShowResults(
                              true
                            );
                          }
                        }}
                        placeholder={strings.newDestinationModal.searchAddressInCityPlaceholder.replace(
                          "{city}",
                          selectedCity.city
                        )}
                      />

                      {searchLoading && (
                        <div className="search-spinner">
                          <span />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {showResults && (
                  <div className="address-search-results">
                    {searchLoading ? (
                      <div className="search-loading">
                        <div className="small-loader" />

                        <span>
                          {
                            strings.newDestinationModal.searchingAddress
                          }
                        </span>
                      </div>
                    ) : searchResults.length >
                      0 ? (
                      searchResults.map(
                        (
                          result,
                          index
                        ) => {
                          const address =
                            result.address ||
                            {};

                          const mainName =
                            result.name ||
                            address.road ||
                            address.pedestrian ||
                            address.residential ||
                            strings.newDestinationModal.foundLocation;

                          return (
                            <button
                              key={`${result.place_id}-${index}`}
                              type="button"
                              className="search-result-item"
                              onClick={() =>
                                handleSelectResult(
                                  result
                                )
                              }
                            >
                              <div className="result-location-icon">
                                ⌖
                              </div>

                              <div className="result-text">
                                <p>
                                  {
                                    mainName
                                  }
                                </p>

                                <span>
                                  {
                                    result.display_name
                                  }
                                </span>
                              </div>
                            </button>
                          );
                        }
                      )
                    ) : (
                      <div className="no-search-result">
                        <span>
                          ⌕
                        </span>

                        <div>
                          <p>
                            {
                              strings.newDestinationModal.searchResultNotFound
                            }
                          </p>

                          <small>
                            {strings.newDestinationModal.searchAddressMorePrecisely.replace(
                              "{city}",
                              selectedCity.city
                            )}
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="address-map-wrapper">
                <MapContainer
                  center={
                    selectedPosition ||
                    selectedCity.center
                  }
                  zoom={
                    selectedPosition
                      ? 17
                      : 13
                  }
                  scrollWheelZoom={
                    true
                  }
                  preferCanvas={
                    true
                  }
                  className="address-map"
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    keepBuffer={4}
                    updateWhenZooming={
                      false
                    }
                    updateWhenIdle={
                      false
                    }
                  />

                  <MapClickHandler
                    onMapClick={
                      handleMapClick
                    }
                  />

                  <MapController
                    selectedPosition={
                      selectedPosition
                    }
                    selectedCity={
                      selectedCity
                    }
                  />

                  {selectedPosition && (
                    <Marker
                      position={
                        selectedPosition
                      }
                      icon={
                        markerIcon
                      }
                      draggable={
                        true
                      }
                      eventHandlers={{
                        dragend:
                          handleMarkerDragEnd,
                      }}
                    >
                      <Tooltip
                        direction="top"
                        offset={[
                          0,
                          -35,
                        ]}
                        permanent={
                          false
                        }
                      >
                        {
                          locationTitle
                        }
                      </Tooltip>
                    </Marker>
                  )}
                </MapContainer>

                {!selectedPosition && (
                  <div className="map-center-hint">
                    <span>
                      {strings.newDestinationModal.mapLocationHint
                        .replace(
                          "{location}",
                          locationTitle
                        )
                        .replace(
                          "{city}",
                          selectedCity.city
                        )}
                    </span>
                  </div>
                )}
              </div>

              {selectedPosition && (
                <div className="selected-address-box">
                  <div className="selected-address-content">
                    <span>
                      {strings.newDestinationModal.locationSelected.replace(
                        "{location}",
                        locationTitle
                      )}
                    </span>

                    <p>
                      {selectedAddress ||
                        strings.newDestinationModal.locationSelectedOnMap.replace(
                          "{location}",
                          locationTitle
                        )}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                className={`address-next-btn ${
                  selectedPosition
                    ? "enabled"
                    : "disabled"
                }`}
                disabled={
                  !selectedPosition
                }
                onClick={
                  handleNextStep
                }
              >
                <span
                  style={{
                    fontSize:
                      "20px",
                  }}
                >
                  {
                    strings.newDestinationModal.nextStep
                  }
                </span>
              </button>
            </div>
          )}

          {step === 2 && (
            <form
              className="address-step-two"
              onSubmit={
                handleSubmit
              }
            >
              <div className="location-summary">
                <div className="summary-icon">
                  ✓
                </div>

                <div className="summary-content">
                  <div className="location-summary-routes">
                    <div className="route-summary-item origin-summary">
                      <span className="route-summary-dot">
                        ●
                      </span>

                      <div>
                        <span
                          style={{
                            fontSize:
                              "15px",
                          }}
                        >
                          {
                            locationTitle
                          }
                        </span>

                        <p
                          style={{
                            fontSize:
                              "15px",
                          }}
                        >
                          {selectedAddress ||
                            strings.newDestinationModal.locationSelectedOnMap.replace(
                              "{location}",
                              locationTitle
                            )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    handlePreviousStep
                  }
                  style={{
                    fontSize:
                      "15px",
                  }}
                >
                  {
                    strings.newDestinationModal.changeLocation
                  }
                </button>
              </div>

              <div className="address-form">
                <div className="row g-4">
                  <div className="col-12">
                    <div className="address-location-card origin-card">
                      <div className="address-location-card-header">
                        <div className="address-location-card-icon">
                          <span>
                            ●
                          </span>
                        </div>

                        <div>
                          <p>
                            {
                              locationTitle
                            }
                          </p>

                          <span>
                            {
                              locationReceiveText
                            }
                          </span>
                        </div>
                      </div>

                      <div className="address-form-grid">
                        <div className="address-field address-field-large">
                          <label>
                            {
                              strings.newDestinationModal.address
                            }

                            <span className="required">
                              *
                            </span>
                          </label>

                          <div className="address-input-wrapper">
                            <span className="address-field-icon">
                              ⌁
                            </span>

                            <input
                              type="text"
                              name="address"
                              value={
                                formData.address
                              }
                              onChange={
                                handleInputChange
                              }
                              placeholder={
                                strings.newDestinationModal.addressPlaceholder
                              }
                              className="form-control address-input"
                            />
                          </div>
                        </div>

                        <div className="address-field">
                          <label>
                            {
                              strings.newDestinationModal.phoneNumber
                            }

                            <span className="required">
                              *
                            </span>
                          </label>

                          <div className="address-input-wrapper">
                            <span className="address-field-icon">
                              ☎
                            </span>

                            <input
                              type="text"
                              name="phone"
                              value={
                                formData.phone
                              }
                              onChange={(e) => {
                                const numericValue =
                                  e.target.value
                                    .replace(
                                      /[^0-9]/g,
                                      ""
                                    )
                                    .slice(
                                      0,
                                      11
                                    );

                                setFormData(
                                  (prev) => ({
                                    ...prev,
                                    phone: numericValue,
                                  })
                                );
                              }}
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={
                                11
                              }
                              placeholder={
                                strings.newDestinationModal.phoneNumberPlaceholder
                              }
                              className="form-control address-input"
                            />
                          </div>
                        </div>

                        <div className="address-field-small">
                          <label>
                            {
                              strings.newDestinationModal.floor
                            }
                          </label>

                          <div className="address-input-wrapper">
                            <span className="address-field-icon">
                              ▦
                            </span>

                            <input
                              type="text"
                              name="floor"
                              value={
                                formData.floor
                              }
                              onChange={
                                handleNumericInputChange
                              }
                              inputMode="numeric"
                              pattern="[0-9]*"
                              placeholder={
                                strings.newDestinationModal.floorPlaceholder
                              }
                              className="form-control address-input"
                            />
                          </div>
                        </div>

                        <div className="address-field address-description-field">
                          <label>
                            {
                              strings.newDestinationModal.locationDescription.replace(
                                "{location}",
                                locationTitle
                              )
                            }
                          </label>

                          <div className="address-input-wrapper address-textarea-wrapper">
                            <span className="address-field-icon textarea-icon">
                              ✎
                            </span>

                            <textarea
                              name="description"
                              value={
                                formData.description
                              }
                              onChange={
                                handleInputChange
                              }
                              placeholder={
                                strings.newDestinationModal.locationDescriptionPlaceholder
                              }
                              rows={
                                4
                              }
                              className="form-control address-textarea"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="address-form-buttons">
                <div className="row w-100 g-2">
                  <div className="col-6">
                    <button
                      type="submit"
                      className="w-100 btn btn-success"
                      style={{
                        fontSize:
                          "20px",
                      }}
                    >
                      {
                        strings.newDestinationModal.submit
                      }
                    </button>
                  </div>

                  <div className="col-6">
                    <button
                      type="button"
                      className="w-100 btn btn-danger"
                      onClick={
                        handlePreviousStep
                      }
                      style={{
                        fontSize:
                          "20px",
                      }}
                    >
                      {
                        strings.newDestinationModal.back
                      }
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
