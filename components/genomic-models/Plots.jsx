import GenomicCard from "./GenomicCard";
import Image from "next/image";
import Ecoli_BSI from "@/public/bayesian-networks/E.coli_BSI.png";
import Ecoli_UTI from "@/public/bayesian-networks/E.coli_UTI.png";
import Klebsiella_Pneumoniae_BSI from "@/public/bayesian-networks/Klebsiella_pneumoniae_BSI.png";
import Klebsiella_Pneumoniae_UTI from "@/public/bayesian-networks/Klebsiella_pneumoniae_UTI.png";

export default function BayesianNetworkPlots() {
    return (
        <div className="flex flex-wrap flex-row w-full my-10 justify-center gap-x-14 gap-y-10">
            <GenomicCard
                image={<Image src={Ecoli_BSI} alt="E.Coli BSI" className="rounded-t-xl" />}
                title="E.Coli BSI"
                link="http://amrorbit.tavlab.iiitd.edu.in:3838/ecolibsi/customDashboard/inst/cd/"
            />
            <GenomicCard
                image={<Image src={Ecoli_UTI} alt="E.Coli UTI" className="rounded-t-xl" />}
                title="E.Coli UTI"
                link="http://amrorbit.tavlab.iiitd.edu.in:3838/ecoliuti/customDashboard/inst/cd/"
            />
            <GenomicCard
                image={<Image src={Klebsiella_Pneumoniae_BSI} alt="Klebsiella Pneumoniae BSI" className="rounded-t-xl" />}
                title="Klebsiella Pneumoniae BSI"
                link="http://amrorbit.tavlab.iiitd.edu.in:3838/klebbsi/customDashboard/inst/cd/"
            />
            <GenomicCard
                image={<Image src={Klebsiella_Pneumoniae_UTI} alt="Klebsiella Pneumoniae UTI" className="rounded-t-xl" />}
                title="Klebsiella Pneumoniae UTI"
                link="http://amrorbit.tavlab.iiitd.edu.in:3838/klebuti/customDashboard/inst/cd/"
            />
        </div>
    );
}