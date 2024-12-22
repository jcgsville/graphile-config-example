export const getNumberEnvironmentVariable = (
    environmentVariableName: string,
    rejectNaN = true,
): number | undefined => {
    const environmentVariable = process.env[environmentVariableName]
    const parsed = environmentVariable
        ? parseInt(environmentVariable, 10)
        : undefined

    if (rejectNaN && parsed !== undefined && isNaN(parsed)) {
        throw new Error(
            `Environment variable is an invalid number: ${environmentVariableName}`,
        )
    }

    return parsed
}
