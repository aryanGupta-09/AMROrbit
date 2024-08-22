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
          description="The Scorecard presents a phase-space plot with resistance levels on the x-axis and the rate of change on the y-axis. Countries in the bottom-left quadrant display favorable AMR profiles, characterized by low initial resistance and a slow increase over time. The remaining quadrants identify countries where targeted interventions are needed due to rising resistance, high baseline resistance, or both."
          link="/scorecards"
        />
        <ExploreTab
          title="Surrogate Indicators"
          img={<Image src={landingLeadLag} alt="Surrogate Indicators" className="rounded-l-xl" />}
          description="Cross-correlation analysis, including lead/lag analysis, was employed to assess the temporal relationships between resistance patterns across different antibiotics. These surrogate indicators act as early warning signs, offering valuable insights for timely intervention and strategic decision-making in combating antimicrobial resistance. Our study identified antibiotic coupling at the global level, which can be further mined to guide and optimize surveillance strategies."
          link="/surrogate-indicators"
        />
        <ExploreTab
          title="Genomic Models"
          img={<Image src={landingGenomic} alt="Genomic Models" className="rounded-l-xl" />}
          description="Bayesian Networks (BNs) were utilized to model the conditional dependencies between antibiotic resistance patterns and genomic data. This approach allows for understanding the relationships between genetic factors and resistance."
          link="/genomic-models"
        />
      </div>
    </main>
  );
}
