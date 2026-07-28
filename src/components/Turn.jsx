export default function Turn({ item, index }) {
    return (
        <>
            <p className='card text-center  px-1 py-1 m-0 iranSansBold col noSelect small'
                style={{
                    minWidth: '2.2rem',
                    height: '1.7rem',

                    fontSize: 12,
                    background: (item.includes("_")?'rgba(255, 0, 255, 0.3)':'')

                }}>{item.replace('_','')}
            </p>
            <label className="position-absolute px-1"
                style={{ marginTop: '-0.95rem' }}>
                <span className="h6 small text-white px-1 noSelect "
                    style={{
                        backgroundColor: '#F50057',
                        borderRadius: '2rem',
                        opacity: 0.8,
                        fontSize: 9
                    }}>{index + 1}</span>
            </label>
        </>
    )
}