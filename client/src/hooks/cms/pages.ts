import { useCmsPage } from "./useCmsPage";
import { rndData } from "@/mocks/rndData";
import { manufacturingData } from "@/mocks/manufacturingData";
import { qualityData } from "@/mocks/qualityData";
import { ehsData } from "@/mocks/ehsData";
import { capabilitiesData } from "@/mocks/capabilitiesData";
import { careersData } from "@/mocks/careersData";
import { contactData } from "@/mocks/contactData";

export const useRndData = () => useCmsPage("rnd", rndData);
export const useManufacturingData = () => useCmsPage("manufacturing", manufacturingData);
export const useQualityData = () => useCmsPage("quality", qualityData);
export const useEhsData = () => useCmsPage("ehs", ehsData);
export const useCapabilitiesData = () => useCmsPage("capabilities", capabilitiesData);
export const useCareersData = () => useCmsPage("careers", careersData);
export const useContactData = () => useCmsPage("contact", contactData);
