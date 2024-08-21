import Landing from "@/components/landing/Landing";
import ExploreTab from "@/components/landing/ExploreTab";
import Image from 'next/image';
import landingScorecard from '@/public/images/landingScorecard.png';
import landingLeadLag from '@/public/images/landingLeadLag.png';
import landingGenomic from '@/public/images/landingGenomic.png';

export default function Home() {
  return (
    <main className="mx-auto">
      <Landing />
      <div className="flex flex-col gap-y-10 mb-6">
        <ExploreTab
          title="Scorecards"
          img={<Image src={landingScorecard} alt="Scorecard" className="rounded-l-xl" />}
          description="Check out our Scorecards."
          link="/scorecards"
        />
        <ExploreTab
          title="Surrogate Indicators"
          img={<Image src={landingLeadLag} alt="Surrogate Indicators" className="rounded-l-xl" />}
          description="Check out our Surrogate Indicators."
          link="/surrogate-indicators"
        />
        <ExploreTab
          title="Genomic Models"
          img={<Image src={landingGenomic} alt="Genomic Models" className="rounded-l-xl" />}
          description="Check out our Genomic Models."
          link="/genomic-models"
        />
      </div>
    </main>
  );
}
