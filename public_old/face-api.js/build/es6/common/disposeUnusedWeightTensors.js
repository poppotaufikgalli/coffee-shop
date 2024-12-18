export function disposeUnusedWeightTensors(weightMap, paramMappings) {
    Object.keys(weightMap).forEach(function (path) {
        if (!paramMappings.some(function (pm) { return pm.originalPath === path; })) {
            weightMap[path].dispose();
        }
    });
}
//# sourceMappingURL=disposeUnusedWeightTensors.js.map