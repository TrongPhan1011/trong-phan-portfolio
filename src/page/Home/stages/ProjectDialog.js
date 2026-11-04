import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiExternalLink, FiGithub, FiX, FiYoutube } from 'react-icons/fi';

function ProjectDialog({ project, onClose }) {
    useEffect(() => {
        if (!project) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        const html = document.documentElement;
        const overflow = html.style.overflow;
        // keep the page (and therefore the build timeline) still while the dialog is open
        html.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            html.style.overflow = overflow;
            window.removeEventListener('keydown', onKey);
        };
    }, [project, onClose]);

    if (!project) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-sm"
            onClick={onClose}
            role="presentation"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={project.title}
                className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-zinc-200"
                    aria-label="Close"
                >
                    <FiX />
                </button>
                <img src={project.img} alt={`${project.title} screenshot`} className="w-full rounded-2xl border border-zinc-100" />
                <h3 className="mt-5 text-2xl font-bold text-zinc-900 sm:text-3xl">{project.title}</h3>
                <p className="mt-1 text-zinc-500">{project.name}</p>
                <p className="mt-4 leading-relaxed text-zinc-700">{project.description}</p>

                <dl className="mt-5 grid gap-3 text-[15px] sm:grid-cols-3">
                    {project.member && (
                        <div>
                            <dt className="text-zinc-500">Team</dt>
                            <dd className="font-medium text-zinc-900">{project.member} members</dd>
                        </div>
                    )}
                    {project.position && (
                        <div>
                            <dt className="text-zinc-500">Role</dt>
                            <dd className="font-medium text-zinc-900">{project.position.join(', ')}</dd>
                        </div>
                    )}
                    <div>
                        <dt className="text-zinc-500">Platforms</dt>
                        <dd className="font-medium text-zinc-900">{project.type.join(', ')}</dd>
                    </div>
                </dl>

                <div className="mt-5 grid gap-3">
                    {(project.technology || [{ type: 'Highlights', detail: project.stack }]).map((t) => (
                        <div key={t.type}>
                            <p className="text-sm font-semibold text-zinc-800">{t.type}</p>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {t.detail.map((d) => (
                                    <span key={d} className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                                        {d}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {(project.url || project.demo || project.src.length > 0) && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        {project.url && (
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-tp-orange px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
                            >
                                <FiExternalLink /> Visit {project.url.replace(/^https?:\/\//, '').split('/')[0]}
                            </a>
                        )}
                        {project.demo && (
                            <a
                                href={project.demo}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-tp-orange px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
                            >
                                <FiYoutube /> Watch demo
                            </a>
                        )}
                        {project.src.map((s) => (
                            <a
                                key={s.url}
                                href={s.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:border-tp-orange hover:text-tp-orange"
                            >
                                <FiGithub /> {s.type}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>,
        document.body,
    );
}

export default ProjectDialog;
