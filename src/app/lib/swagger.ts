import { createSwaggerSpec } from "next-swagger-doc";

export async function getApiDocs(): Promise<Record<string, unknown>> {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API 문서",
        version: "1.0.0",
        description: "Next.js + Swagger UI 통합 예제",
      },
    },
  }) as Record<string, unknown>;
  return spec;
}
