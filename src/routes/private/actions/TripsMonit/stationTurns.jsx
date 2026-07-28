import { useState } from "react"
import HorizentalDraggable from '../../../../components/horizentalDraggable'
import Turn from "../../../../components/Turn"
import StationTurn from "../../../../modals/tripMonit/stationTurn"

export default function StationTurns(props) {


    return (<>

        {
            props?.data?.map((item, index) => {
                return <div
                    key={index}
                    className='d-flex py-1 px-2'
                    style={{ backgroundColor: index % 2 ? '#EEEEEE' : '' }}
                    dir='rtl' >

                    <StationTurn
                        turns={item?.turns} >
                        <p className='text-center text-white iranSansBold
                          p-0 m-0  card bg-primary d-flex flex-row 
                          justify-content-center align-items-center
                          col-1 ms-3
                          noSelect aPointer'
                            onContextMenu={() => {
                                
                            }}
                            style={{ height: '2rem', width: '4rem' }}>
                            <span className='col-8' >{item?.stCode}</span>
                            <span className='p-0 opacity-50'>|</span>

                            <span className=' small opacity-50 flex-fill text-center'>{item?.turns?.split(",")?.length}</span>
                        </p>
                    </StationTurn>


                    {item?.turns == '' ? <></> : <>
                        {props?.collapsed ? <HorizentalDraggable>
                            <div className='w-auto d-flex flex-fill  overflow-hidden h-100 '>
                                {
                                    item?.turns?.split(",")?.map((item, index) => {
                                        return <div key={index} className='w-auto mb-0 mx-1 position-relative' >
                                            <Turn item={item} index={index} />
                                        </div>

                                    })
                                }
                            </div>
                        </HorizentalDraggable>
                            :
                            <div className='w-auto row overflow-hidden h-100 g-2 '>
                                {
                                    item?.turns?.split(",")?.map((item, index) => {
                                        return <div key={index} className='col-3 mb-1 w-auto position-relative' >

                                            <Turn item={item} index={index} />
                                        </div>

                                    })
                                }
                            </div>
                        }
                    </>}

                </div>

            })
        }
    </>
    )
}


