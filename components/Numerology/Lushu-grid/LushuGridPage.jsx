import { personalityDestinyTabs } from "./constants";
import {
  buildLoShuRepetitionGrid,
  getNumberRelationshipType,
} from "./helpers";
import SummaryAndGrid from "./SummaryAndGrid";
import RepetitionEffects from "./RepetitionEffects";
import RelationshipsAndSectorEffects from "./RelationshipsAndSectorEffects";
import PersonalityDestinyDetails from "./PersonalityDestinyDetails";
import PersonalYearMatrix from "./PersonalYearMatrix";

export default function LushuGridPage({
  losuResult,
  personalYearResult,
  personalYearMatrix,
  fromYear,
  setFromYear,
  toYear,
  setToYear,
  personalityDestinyDetails,
  numberRelationships,
  sectorWiseEffects,
  loShuRepetitionEffects,
  activePersonalityDestinyTab,
  setActivePersonalityDestinyTab,
  activeSectorEffectTab,
  setActiveSectorEffectTab,
  personalYearMatrixApi,
  isSubmitting,
}) {
  const countEntries = losuResult?.counts
    ? Object.entries(losuResult.counts)
    : [];
  const summaryCards = [
    {
      label: "Date of Birth",
      value: losuResult?.dob,
      detail: "Source date used for numerology calculation",
    },
    {
      label: "Personality Number",
      value: losuResult?.driverNumber,
      detail: losuResult?.driverAddedToGrid
        ? "Added to grid"
        : "Not added to grid",
    },
    {
      label: "Destiny Number",
      value: losuResult?.destinyNumber,
      detail: losuResult?.destinyAddedToGrid
        ? "Added to grid"
        : "Not added to grid",
    },
  ];

  const summaryCardsSecond = [
    {
      label: "kua Number",
      value: losuResult?.kuaNumber,
      detail: losuResult?.driverAddedToGrid
        ? "Added to grid"
        : "Not added to grid",
    },
    {
      label: "Name Number",
      value: losuResult?.nameNumber,
      detail: losuResult?.driverAddedToGrid
        ? "Added to grid"
        : "Not added to grid",
    },
    {
      label: "Running Age",
      value: losuResult?.runningAge,
      detail: losuResult?.destinyAddedToGrid
        ? "Added to grid"
        : "Not added to grid",
    },
    {
      label: "Zodiac Number",
      value: losuResult?.zodiacNumber,
      detail: losuResult?.destinyAddedToGrid
        ? "Added to grid"
        : "Not added to grid",
    },
    {
      label: "Zodiac Sign",
      value: losuResult?.zodiacSign,
      detail: losuResult?.destinyAddedToGrid
        ? "Added to grid"
        : "Not added to grid",
    },
  ];
  const activePersonalityDestinyDetails =
    personalityDestinyDetails[activePersonalityDestinyTab];
  const activePersonalityDestinyMeta =
    personalityDestinyTabs.find(
      (tab) => tab.key === activePersonalityDestinyTab,
    ) || personalityDestinyTabs[0];
  const activePersonalityDestinyNumber =
    activePersonalityDestinyTab === "personality"
      ? losuResult?.driverNumber
      : losuResult?.destinyNumber;
  const personalityRelationship = numberRelationships.find(
    (item) => Number(item.planetNumber) === Number(losuResult?.driverNumber),
  );
  const destinyRelationship = numberRelationships.find(
    (item) => Number(item.planetNumber) === Number(losuResult?.destinyNumber),
  );
  const relationType = getNumberRelationshipType(
    personalityRelationship,
    losuResult?.destinyNumber,
  );
  const activeSectorEffect = sectorWiseEffects?.[activeSectorEffectTab]?.trim();
  const loShuRepetitionGrid = buildLoShuRepetitionGrid(loShuRepetitionEffects);

  return (
    <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[0.85fr_1fr]">
      <SummaryAndGrid
        summaryCards={summaryCards}
        personalYearResult={personalYearResult}
        losuResult={losuResult}
        countEntries={countEntries}
        summaryCardsSecond={summaryCardsSecond}
      />

      <RepetitionEffects
        loShuRepetitionEffects={loShuRepetitionEffects}
        loShuRepetitionGrid={loShuRepetitionGrid}
      />

      <RelationshipsAndSectorEffects
        losuResult={losuResult}
        personalityRelationship={personalityRelationship}
        destinyRelationship={destinyRelationship}
        relationType={relationType}
        sectorWiseEffects={sectorWiseEffects}
        activeSectorEffectTab={activeSectorEffectTab}
        setActiveSectorEffectTab={setActiveSectorEffectTab}
        activeSectorEffect={activeSectorEffect}
      />

      <PersonalityDestinyDetails
        activePersonalityDestinyTab={activePersonalityDestinyTab}
        setActivePersonalityDestinyTab={setActivePersonalityDestinyTab}
        activePersonalityDestinyDetails={activePersonalityDestinyDetails}
        activePersonalityDestinyMeta={activePersonalityDestinyMeta}
        activePersonalityDestinyNumber={activePersonalityDestinyNumber}
      />

      <PersonalYearMatrix
        fromYear={fromYear}
        setFromYear={setFromYear}
        toYear={toYear}
        setToYear={setToYear}
        personalYearMatrixApi={personalYearMatrixApi}
        isSubmitting={isSubmitting}
        personalYearMatrix={personalYearMatrix}
        personalYearResult={personalYearResult}
      />
    </div>
  );
}
