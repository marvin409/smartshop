import React from "react";
import StoreCategoryPage from "./StoreCategoryPage";
import { bestSellersPageData } from "../data/storeSections";

const BestSellersPage = () => <StoreCategoryPage {...bestSellersPageData} />;

export default BestSellersPage;
