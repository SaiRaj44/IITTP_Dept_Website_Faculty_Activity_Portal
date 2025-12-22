/**
 * Enhanced fetch API wrapper with error handling
 * @param url API endpoint URL
 * @param options Fetch options
 * @returns Parsed JSON response
 */
export async function fetchApi<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    // If the URL is already absolute or starts with the basePath, use it as is
    const finalUrl = url.startsWith('http') || url.startsWith('') 
      ? url 
      : `${url}`;

    const response = await fetch(finalUrl, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

/**
 * Generic function to create a resource
 * @param endpoint API endpoint
 * @param data Resource data
 * @returns API response data
 */
export async function createResource<T, R = unknown>(
  endpoint: string,
  data: T
): Promise<R> {
  return fetchApi<R>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Generic function to update a resource
 * @param endpoint API endpoint
 * @param id Resource ID
 * @param data Resource data
 * @returns API response data
 */
export async function updateResource<T, R = unknown>(
  endpoint: string,
  id: string,
  data: T
): Promise<R> {
  return fetchApi<R>(`${endpoint}?id=${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Generic function to delete a resource
 * @param endpoint API endpoint
 * @param id Resource ID
 * @returns API response data
 */
export async function deleteResource<R = unknown>(
  endpoint: string,
  id: string
): Promise<R> {
  return fetchApi<R>(`${endpoint}?id=${id}`, {
    method: "DELETE",
  });
}

/**
 * Generic function to fetch resources
 * @param endpoint API endpoint
 * @param params Query parameters
 * @returns API response data
 */
export async function getResources<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T[]> {
  const url = new URL(endpoint, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });

  const data = await fetchApi<{
    success: boolean;
    message?: string;
    data: T[];
  }>(url.toString());

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch resources");
  }

  return data.data;
}

/**
 * Generic function to fetch a single resource by ID
 * @param endpoint API endpoint
 * @param id Resource ID
 * @returns API response data
 */
export async function getResourceById<T>(
  endpoint: string,
  id: string
): Promise<T> {
  const data = await fetchApi<{ success: boolean; message?: string; data: T }>(
    `${endpoint}?id=${id}`
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch resource");
  }

  return data.data;
}
