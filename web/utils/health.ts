'use server'

export interface ServiceStatus {
  name: string
  status: "Healthy" | "Loading" | "Failed"
}

export async function fetchHealthStatus(): Promise<ServiceStatus[]> {
  try {
    const bffUrl = process.env.BFF_URL || 'http://localhost:8001';
    const fileConvertorUrl = process.env.FILE_CONVERTER_URL || 'http://localhost:8000';
    const modekUrl = process.env.FACE_RECOGNITION_URL || 'http://localhost:8002';

    const healthChecks = [
      {
        name: 'BFF Service',
        url: `${bffUrl}/health`,
      },
      {
        name: 'File Convertor Service',
        url: `${fileConvertorUrl}/health`,
      },
      {
        name: 'Face Recognition Service',
        url: `${modekUrl}/health`,
      },
    ];

    const results = await Promise.allSettled(
      healthChecks.map(async ({ name, url }) => {
        try {
          const response = await fetch(url, {
            cache: 'no-store',
            next: { revalidate: 0 },
          });

          if (!response.ok) {
            return {
              name,
              status: 'Failed' as const,
            };
          }

          return {
            name,
            status: 'Healthy' as const,
          };
        } catch (error) {
          return {
            name,
            status: 'Failed' as const,
          };
        }
      })
    );

    return results.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          name: 'Unknown Service',
          status: 'Failed' as const,
        };
      }
    });
  } catch (error) {
    return [
      { name: 'BFF Service', status: 'Failed' as const },
      { name: 'File Convertor Service', status: 'Failed' as const },
      { name: 'Face Recognition Service', status: 'Failed' as const },
    ];
  }
}