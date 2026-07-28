import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import 'leaflet/dist/leaflet.css';
import _ from 'lodash'
import { CgClose } from 'react-icons/cg'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AxiosPrivate } from "../../app/axiosPrivate";
import endpoints from "../../app/endpoints";
import toast from "../../components/toast";
import TripMonitContext from "../../contexts/tripMonitContext";
// آیتم‌ها برای لیست

export default function StationTurn(props) {
    const [turns, setTurns] = useState(props?.turns);
    var tmContext = useContext(TripMonitContext)
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        var t = turns.split(',');

        console.log(t[result.source.index], t[result.destination.index])
        if (result.source.index != result.destination.index)
            changeTurn(t[result.source.index], result.destination.index + 1)

        // const newItems = Array.from(items);
        // const [reorderedItem] = newItems.splice(result.source.index, 1);
        // newItems.splice(result.destination.index, 0, reorderedItem);

        // setItems(newItems);
    };


    var [show, setShow] = useState(false)
    var [params, setParams] = useState(props?.params)

    useEffect(() => {
        if (show) {
            setTurns(props?.turns)
            setParams({ ...props?.params, tripStatus: -2 })
        }
    }, [show])

    const handleOnChange = (e) => {
        try {
            var value = e.target.value
            var name = e.target.name
            setParams(prevState => ({
                ...prevState,
                [name]: value
            }))
        } catch (err) {
            console.log(err)
        }
    }
    var removeTurn = (driverCode) => {
        driverCode = driverCode.replace('_', '')

        AxiosPrivate.delete(endpoints.stationTurn, {
            data: {
                driverCode
            }
        }).then(res => {
            if (res?.data?.status == 1) {
                toast.Success(res?.data?.msg)
                setTurns(res?.data?.newTurn)
            }
            tmContext?.sync()
        })
    }

    var changeTurn = (driverCode, turnNumber) => {
        driverCode = driverCode.replace('_', '')
        AxiosPrivate.put(endpoints.stationTurn, {
            driverCode,
            turnNumber
        }).then(res => {
            if (res?.data?.status == 1) {
                toast.Success(res?.data?.msg)
                setTurns(res?.data?.newTurn)
            }
            tmContext?.sync()
        })
    }



    const handleShow = (e) => {
        setShow(true)
    };

    var newFirstChild

    if (props?.children)
        newFirstChild = React.cloneElement(
            props?.children?.length > 1
                ? props.children[0]
                : props.children,
            { onClick: handleShow });



    return (<>
        {newFirstChild}
        <Modal show={show}
            centered
            onHide={() => {
                setShow(false)
            }}
            size="sm"
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header  p-0 m-0 card " dir="rtl">
                <div className="row p-0 m-0 p-2">
                    <label className="p-0 m-0 opacity-50 text-center">برای جابجای نوبت ها بکشید و رها کنید</label>

                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="droppable-list">
                            {(provided) => (
                                <ul
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={{ listStyleType: 'none', padding: 0 }}>
                                    {turns.trim() != '' ? turns.split(",").map((item, index) => (
                                        <Draggable key={index} draggableId={"" + index} index={index}>
                                            {(provided) => (
                                                <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}>
                                                    <div className="card mt-2" style={{
                                                        background: (item.includes("_") ? 'rgba(255, 0, 255, 0.3)' : '')
                                                    }}>
                                                        <div className="d-flex p-2 justify-content-center align-items-center ">
                                                            <h3 className="iranSansBold p-0 m-0 px-2 opacity-50">{index + 1}</h3>
                                                            <div className="vr mx-2"></div>
                                                            <h3 className="iranSansBold p-0 m-0">{item.replace('_', '')}</h3>
                                                            <CgClose
                                                                className="text-danger me-auto aPointer "
                                                                size={30}
                                                                onClick={(e) => {
                                                                    removeTurn(item)
                                                                }} />
                                                        </div>
                                                    </div>
                                                </li>
                                            )}
                                        </Draggable>
                                    )) : <></>}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>

                </div>

            </Modal.Body>

        </Modal>
    </>)
}
