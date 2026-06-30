import {
    StudioHero,
    StudioBuilder,
    StudioConnector,
    StudioHobbies,
    StudioContact,
    StudioFooter,
} from "@/sections/studio";
import { VariantBody } from "@/components/studio/VariantBody";
import { VariantNav } from "@/components/shared/VariantNav";

export default function StudioPage() {
    return (
        <>
            <VariantBody />
            <VariantNav tone="dark" />

            <main className="relative w-full bg-background text-foreground">
                <StudioHero />
                <StudioBuilder />
                <StudioConnector />
                <StudioHobbies />
                <StudioContact />
                <StudioFooter />
            </main>
        </>
    );
}
