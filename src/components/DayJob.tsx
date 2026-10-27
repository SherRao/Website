import { latestStint, stintShort, yearRange } from "@/content/dates";
import type { Job } from "@/content/types";

/** Where a job's name links: its story elsewhere on the page, or its site. */
const jobHref = (job: Job) => job.link ?? job.url;

/**
 * The day job as a ledger: one row per job, newest first, read like a playbill's credits. Every fact is text in
 * reading order; the dotted leaders are decoration.
 */
export const Ledger = ({ jobs }: { jobs: Job[] }) => (
    <ol className="ledger">
        {jobs.map((job) => {
            const href = jobHref(job);
            const external = href?.startsWith("http");
            return (
                <li key={job.id} className="job">
                    <span className="when label-s">
                        {job.stints.length > 1
                            ? [...job.stints]
                                  .sort((a, b) => a.start.localeCompare(b.start))
                                  .map((s, i) => <span key={i}>{stintShort(s)}</span>)
                            : yearRange(job.stints)}
                    </span>
                    <span className="org">
                        {href ? (
                            <a href={href} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
                                {job.org}
                            </a>
                        ) : (
                            job.org
                        )}
                    </span>
                    <i className="leader" aria-hidden="true" />
                    <div className="role">
                        <span className="title">{latestStint(job.stints).role}</span>
                        <p className="line">
                            <span aria-hidden="true">→ </span>
                            {job.line}
                        </p>
                    </div>
                </li>
            );
        })}
    </ol>
);
