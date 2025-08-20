import React from 'react'

export default function ProductLoader() {
    return (
        <main className='d-flex justify-content-center flex-column align-items-center' style={{"height":"50vh"}}>
            <div className="spinner-grow" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            {/* From Uiverse.io by csozidev */}
            <div className="loader">
                <div className="box box-1">
                    <div className="side-left" />
                    <div className="side-right" />
                    <div className="side-top" />
                </div>
                <div className="box box-2">
                    <div className="side-left" />
                    <div className="side-right" />
                    <div className="side-top" />
                </div>
                <div className="box box-3">
                    <div className="side-left" />
                    <div className="side-right" />
                    <div className="side-top" />
                </div>
                <div className="box box-4">
                    <div className="side-left" />
                    <div className="side-right" />
                    <div className="side-top" />
                </div>
            </div>
        </main>

    )
}
