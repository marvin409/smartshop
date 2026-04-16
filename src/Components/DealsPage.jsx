import React from "react";
import StoreCategoryPage from "./StoreCategoryPage";
import { dealsPageData } from "../data/storeSections";

const DealsPage = () => <StoreCategoryPage {...dealsPageData} />;

export default DealsPage;
