export const requireEnvironmentVariable = (
    variableName: string,
    errorMessage?: string,
): string => {
    const value = process.env[variableName]
    if (!value) {
        throw new Error(
            errorMessage ??
                `Missing required environment variable: ${variableName}.`,
        )
    }
    return value
}
