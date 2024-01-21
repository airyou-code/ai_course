import React from 'react'

const Card = () => {
  return (
    <div className="card card-flush h-md-50 mb-5 mb-xl-10">
      <div className="card-header pt-1">
        <div className="card-title d-flex flex-column">
          <div className="d-flex align-items-center">
            <span className="fs-4 fw-semibold text-gray-500 me-1 align-self-start">
              $
            </span>

            <span className="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">
              69,700
            </span>

            <span className="badge badge-light-success fs-base">
              <i className="ki-duotone ki-arrow-up fs-5 text-success ms-n1">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
              2.2%
            </span>
          </div>

          <span className="text-gray-500 pt-1 fw-semibold fs-6">
            Projects Earnings in April
          </span>
        </div>
      </div>

      <div className="card-body pt-2 pb-4 d-flex flex-wrap align-items-center">
        <div className="d-flex flex-center me-5 pt-2">
          <div
            id="kt_card_widget_17_chart"
            style={{ minWidth: "70px", minHeight: "70px" }}
            data-kt-size="70"
            data-kt-line="11"
          >
            <span></span>
            <canvas height="70" width="70"></canvas>
          </div>
        </div>

        <div className="d-flex flex-column content-justify-center flex-row-fluid">
          <div className="d-flex fw-semibold align-items-center">
            <div className="bullet w-8px h-3px rounded-2 bg-success me-3"></div>

            <div className="text-gray-500 flex-grow-1 me-4">Leaf CRM</div>

            <div className="fw-bolder text-gray-700 text-xxl-end">$7,660</div>
          </div>

          <div className="d-flex fw-semibold align-items-center my-3">
            <div className="bullet w-8px h-3px rounded-2 bg-primary me-3"></div>

            <div className="text-gray-500 flex-grow-1 me-4">Mivy App</div>

            <div className="fw-bolder text-gray-700 text-xxl-end">$2,820</div>
          </div>

          <div className="d-flex fw-semibold align-items-center">
            <div
              className="bullet w-8px h-3px rounded-2 me-3"
              style={{ backgroundColor: "#E4E6EF" }}
            ></div>

            <div className="text-gray-500 flex-grow-1 me-4">Others</div>

            <div className=" fw-bolder text-gray-700 text-xxl-end">$45,257</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card
