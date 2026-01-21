"use server";

import { NextResponse } from "next/server";
import connectMongoDB from "@/app/lib/mongodb";
import Asset from "@/app/models/asset-management/assets";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

interface ModelCount {
    model: string;
    brand: string;
    count: number;
}

interface CategoryStats {
    total: number;
    byModel: ModelCount[];
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectMongoDB();

        // Define all subcategories we want to track
        const trackedSubcategories = [
            // Peripherals
            "Monitor",
            "Keyboard",
            "Mouse",
            // Systems - shown separately
            "Desktop",
            "Workstation",
            "All-In-One",
        ];

        // Single aggregation for all tracked subcategories - grouped by model (assetName)
        const subcategoryStats = await Asset.aggregate([
            {
                $match: {
                    $or: [
                        { category: "Peripherals", subcategory: { $in: ["Monitor", "Keyboard", "Mouse"] } },
                        { category: "Systems", subcategory: { $in: ["Desktop", "Workstation", "All-In-One"] } },
                    ],
                },
            },
            {
                $group: {
                    _id: {
                        subcategory: "$subcategory",
                        model: "$assetName",
                        brand: "$brand"
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    subcategory: "$_id.subcategory",
                    model: "$_id.model",
                    brand: "$_id.brand",
                    count: 1,
                    _id: 0,
                },
            },
            { $sort: { count: -1 } },
        ]);

        // Get total counts per subcategory
        const subcategoryTotals = await Asset.aggregate([
            {
                $match: {
                    $or: [
                        { category: "Peripherals", subcategory: { $in: ["Monitor", "Keyboard", "Mouse"] } },
                        { category: "Systems", subcategory: { $in: ["Desktop", "Workstation", "All-In-One"] } },
                    ],
                },
            },
            {
                $group: {
                    _id: "$subcategory",
                    count: { $sum: 1 },
                },
            },
        ]);

        // Get faulty/In Repair items - grouped by model
        const faultyStats = await Asset.aggregate([
            {
                $match: {
                    status: "In Repair",
                },
            },
            {
                $group: {
                    _id: { model: "$assetName", brand: "$brand", subcategory: "$subcategory" },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    model: "$_id.model",
                    brand: "$_id.brand",
                    subcategory: "$_id.subcategory",
                    count: 1,
                    _id: 0,
                },
            },
            { $sort: { count: -1 } },
        ]);

        const faultyTotalCount = await Asset.countDocuments({ status: "In Repair" });

        // Initialize stats for all tracked subcategories
        const stats: Record<string, CategoryStats> = {};
        trackedSubcategories.forEach((sub) => {
            stats[sub] = { total: 0, byModel: [] };
        });
        stats["Faulty"] = { total: faultyTotalCount, byModel: [] };

        // Process subcategory stats
        subcategoryStats.forEach((item) => {
            const subcategory = item.subcategory as string;
            if (stats[subcategory]) {
                stats[subcategory].byModel.push({
                    model: item.model,
                    brand: item.brand,
                    count: item.count,
                });
            }
        });

        // Process faulty stats
        faultyStats.forEach((item) => {
            stats.Faulty.byModel.push({
                model: item.model,
                brand: item.brand,
                count: item.count,
            });
        });

        // Set totals from aggregation results
        subcategoryTotals.forEach((item) => {
            const subcategory = item._id as string;
            if (stats[subcategory]) {
                stats[subcategory].total = item.count;
            }
        });

        return NextResponse.json({ success: true, data: stats });
    } catch (error) {
        console.error("Error in GET /api/assets/stats:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch asset stats" },
            { status: 500 }
        );
    }
}
