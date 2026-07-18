import { Location, Path } from "../models/models.js";

const campusLocations = [
    { name: "Boys Hostel", code: "BH", latitude: 28.81637, longitude: 77.13299, type: "LOCATION" },
    { name: "Admin Block", code: "AB", latitude: 28.81164, longitude: 77.13299, type: "LOCATION" },
    { name: "Basketball Court", code: "BC", latitude: 28.81542, longitude: 77.13170, type: "LOCATION" },
    { name: "Sports Ground", code: "SG", latitude: 28.81256, longitude: 77.13253, type: "LOCATION" },
    { name: "Main Gate", code: "MG", latitude: 28.81617, longitude: 77.13363, type: "LOCATION" },
    { name: "Library", code: "LIB", latitude: 28.81410, longitude: 77.13230, type: "LOCATION" },
    { name: "Academic Block", code: "ACB", latitude: 28.81380, longitude: 77.13120, type: "LOCATION" },
];

const campusPaths = [
    ["BH", "MG"],
    ["MG", "BC"],
    ["BC", "LIB"],
    ["LIB", "ACB"],
    ["ACB", "SG"],
    ["SG", "AB"],
    ["LIB", "AB"],
    ["MG", "AB"],
];

export const seedCampusData = async () => {
    try {
        const locationCount = await Location.countDocuments();
        if (locationCount > 0) {
            return { seeded: false, count: locationCount };
        }

        const insertedLocations = await Location.insertMany(campusLocations);
        const locationMap = Object.fromEntries(
            insertedLocations.map((location) => [location.code, location._id])
        );

        const pathDocs = campusPaths.map(([fromCode, toCode]) => ({
            node1: locationMap[fromCode],
            node2: locationMap[toCode],
        }));

        await Path.insertMany(pathDocs);

        return { seeded: true, locations: insertedLocations.length, paths: pathDocs.length };
    } catch (error) {
        console.warn("Campus data seeding skipped:", error.message);
        return { seeded: false, error: error.message };
    }
};
