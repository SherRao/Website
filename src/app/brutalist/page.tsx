import {
    BrutalistHero,
    BrutalistEngineering,
    BrutalistCommunity,
    BrutalistCreative,
    BrutalistContact,
    BrutalistFooter,
} from "@/sections/brutalist";
import { VariantBody } from "@/components/brutalist/VariantBody";
import { VariantNav } from "@/components/shared/VariantNav";

export default function BrutalistPage() {
    return (
        <>
            <VariantBody />
            <VariantNav tone="light" />

            <main className="relative w-full bg-bone text-ink">
                <BrutalistHero />
                <BrutalistEngineering />
                <BrutalistCommunity />
                <BrutalistCreative />
                <BrutalistContact />
                <BrutalistFooter />
            </main>
        </>
    );
}
