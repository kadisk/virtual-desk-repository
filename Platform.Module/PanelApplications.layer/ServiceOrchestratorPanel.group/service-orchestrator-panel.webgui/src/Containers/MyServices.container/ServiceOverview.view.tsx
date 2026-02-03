import * as React from "react"

import ServiceCard from "./ServiceCard"

const ServiceOverview = ({
    servicesList,
    onSelectService,
    onStartService,
    onStopService
}) => {
    return <div className="py-4">
        {
            servicesList
            && <div className="row">
                {
                    servicesList.map((provisionedService, index) => (
                        <div key={index} className="col-md-4">
                            <ServiceCard
                                serviceId={provisionedService.serviceId}
                                serviceIdSelected={servicesList}
                                status={provisionedService.status}
                                serviceName={provisionedService.serviceName}
                                originRepositoryNamespace={provisionedService.originRepositoryNamespace}
                                originPackageName={provisionedService.originPackageName}
                                originPackageType={provisionedService.originPackageType}
                                onSelectService={onSelectService}
                                onStartService={onStartService}
                                onStopService={onStopService}
                            />
                        </div>))
                }
            </div>
        }
    </div>
}

export default ServiceOverview