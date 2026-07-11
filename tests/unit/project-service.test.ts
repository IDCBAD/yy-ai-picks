import { describe, expect, it } from "vitest";

import { contentData } from "@/content";
import { LocalProjectRepository } from "@/repositories";
import { ProjectService } from "@/services";

describe("ProjectService", () => {
  it("groups published projects by every status in display order", async () => {
    const service = new ProjectService({ projects: new LocalProjectRepository(contentData) });

    const result = await service.getPageData();

    expect(result.projectCount).toBe(4);
    expect(result.groups.map((group) => group.status)).toEqual([
      "launched",
      "iterating",
      "prototype",
      "experiment",
      "paused",
    ]);
    expect(result.groups.map((group) => group.count)).toEqual([1, 2, 1, 0, 0]);
    expect(result.groups.flatMap((group) => group.projects)).toHaveLength(4);
    expect(result.lastUpdatedAt).toBe("2026-07-10T00:00:00.000Z");
  });

  it("excludes unpublished projects from status groups", async () => {
    const data = structuredClone(contentData);
    data.projects[0].publishStatus = "draft";
    const service = new ProjectService({ projects: new LocalProjectRepository(data) });

    const groups = await service.getStatusGroups();

    expect(groups.flatMap((group) => group.projects)).toHaveLength(3);
  });
});
