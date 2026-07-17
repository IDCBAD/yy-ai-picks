import type { Recommendation } from "../../types";

import { aiAssistants } from "./ai-assistants";
import { automationTools } from "./automation";
import { creationTools } from "./creation";
import { developmentTools } from "./development";
import { knowledgeTools } from "./knowledge";
import { resourceTools } from "./resources";

export const recommendations: Recommendation[] = [
  ...aiAssistants,
  ...developmentTools,
  ...knowledgeTools,
  ...automationTools,
  ...creationTools,
  ...resourceTools,
];
