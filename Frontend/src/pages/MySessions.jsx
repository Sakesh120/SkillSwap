import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getSessions,
  scheduleSession as scheduleSessionApi,
  completeSession as completeSessionApi,
} from "../api/session.api";
import { useAuth } from "../context/AuthContext";

function MySessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [scheduledAtInput, setScheduledAtInput] = useState("");
  const [scheduleError, setScheduleError] = useState(null);
  const [scheduling, setScheduling] = useState(false);

  const [completingId, setCompletingId] = useState(null);

  const loadSessions = useCallback(async () => {
    const res = await getSessions();
    setSessions(res.data || []);
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        setError(null);
        await loadSessions();
      } catch (err) {
        console.error(err);
        setError("Unable to load your sessions.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [loadSessions]);

  const getPartner = (session) => {
    if (!user || !session.users?.length) return null;
    return session.users.find((u) => String(u._id) !== String(user._id));
  };

  const getPartnerName = (session) => getPartner(session)?.name || "Partner";

  const getTopic = (session) =>
    session.skillRequested || session.skillsOffered || "Skill session";

  const userMarkedComplete = (session) =>
    session.completeBy?.some((id) => String(id) === String(user?._id));

  const openScheduleModal = (session) => {
    setActionError(null);
    setSelectedSession(session);
    setScheduledAtInput("");
    setScheduleError(null);
    setScheduleModalOpen(true);
  };

  const closeScheduleModal = () => {
    setScheduleModalOpen(false);
    setSelectedSession(null);
    setScheduledAtInput("");
    setScheduleError(null);
  };

  const handleScheduleSubmit = async () => {
    setScheduleError(null);
    if (!selectedSession) return;

    if (!scheduledAtInput?.trim()) {
      setScheduleError("Please select a date and time.");
      return;
    }

    const d = new Date(scheduledAtInput);
    if (Number.isNaN(d.getTime())) {
      setScheduleError("Invalid date and time.");
      return;
    }

    if (d.getTime() < Date.now()) {
      setScheduleError("Please choose a future date and time.");
      return;
    }

    try {
      setScheduling(true);
      await scheduleSessionApi(selectedSession._id, d.toISOString());
      await loadSessions();
      closeScheduleModal();
    } catch (err) {
      setScheduleError(
        err.response?.data?.message ||
          err.message ||
          "Could not schedule session.",
      );
    } finally {
      setScheduling(false);
    }
  };

  const handleComplete = async (sessionId) => {
    setActionError(null);
    try {
      setCompletingId(sessionId);
      await completeSessionApi(sessionId);
      await loadSessions();
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Could not update session.",
      );
    } finally {
      setCompletingId(null);
    }
  };

  const statusStyles = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    scheduled: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };

  const sortedSessions = useMemo(() => {
    return [...sessions].sort(
      (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0),
    );
  }, [sessions]);

  return (
    <div
      className="min-h-screen min-w-screen pt-24 mt-25 pb-12 px-4 md:px-6"
      style={{
        backgroundImage: "url('/dashboardbg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My sessions</h1>
          <p className="text-sm text-gray-600 mt-1">
            View details, schedule a time, then mark complete after the session
            happens.
          </p>
        </div>

        {actionError && (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {actionError}
          </div>
        )}

        {loading && <p className="text-sm text-gray-600">Loading sessions…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && sessions.length === 0 && (
          <div className="rounded-2xl border border-white/40 bg-white/20 backdrop-blur-lg p-8 text-center text-gray-600">
            You don&apos;t have any sessions yet.
          </div>
        )}

        <div className="grid gap-4">
          {sortedSessions.map((session) => {
            const partner = getPartner(session);
            const completed = session.status === "completed";
            const isScheduled = session.status === "scheduled";
            const isPending = session.status === "pending";
            const iConfirmed = userMarkedComplete(session);

            const canSchedule = !completed;
            const canComplete = isScheduled && !completed && !iConfirmed;

            return (
              <div
                key={session._id}
                className="rounded-2xl border border-white/40 bg-white/85 backdrop-blur-md shadow-sm p-5 md:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`inline-flex text-xs font-medium px-2.5 py-0.5 rounded-full border capitalize ${
                          statusStyles[session.status] ||
                          "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {session.status || "unknown"}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Session with {getPartnerName(session)}
                    </h2>
                    {partner?.email && (
                      <p className="text-sm text-gray-500">{partner.email}</p>
                    )}
                  </div>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm border-t border-gray-100 pt-4">
                  <div>
                    <dt className="text-gray-500">Skill offered</dt>
                    <dd className="font-medium text-gray-900 mt-0.5">
                      {session.skillsOffered || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Skill requested</dt>
                    <dd className="font-medium text-gray-900 mt-0.5">
                      {session.skillRequested || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Topic</dt>
                    <dd className="font-medium text-gray-900 mt-0.5">
                      {getTopic(session)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Scheduled for</dt>
                    <dd className="font-medium text-gray-900 mt-0.5">
                      {session.scheduledAt
                        ? new Date(session.scheduledAt).toLocaleString()
                        : "Not scheduled yet"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Created</dt>
                    <dd className="font-medium text-gray-900 mt-0.5">
                      {session.createdAt
                        ? new Date(session.createdAt).toLocaleString()
                        : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Last updated</dt>
                    <dd className="font-medium text-gray-900 mt-0.5">
                      {session.updatedAt
                        ? new Date(session.updatedAt).toLocaleString()
                        : "—"}
                    </dd>
                  </div>
                </dl>

                {isScheduled && !completed && (
                  <p className="text-xs text-gray-600 mt-3">
                    {iConfirmed
                      ? "You marked this session complete. Waiting for your partner to confirm."
                      : session.completeBy?.length > 0
                        ? "Your partner confirmed completion. You can confirm below."
                        : "Both of you must mark complete after the session."}
                  </p>
                )}

                {isPending && (
                  <p className="text-xs text-amber-800 mt-3 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    Schedule a date and time before you can mark this session
                    complete.
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-5">
                  {!completed && (
                    <>
                      <button
                        type="button"
                        disabled={!canSchedule}
                        onClick={() => openScheduleModal(session)}
                        className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isScheduled ? "Reschedule" : "Schedule"}
                      </button>

                      <button
                        type="button"
                        disabled={!canComplete}
                        title={
                          isPending
                            ? "Schedule the session first"
                            : iConfirmed && !completed
                              ? "You already confirmed"
                              : undefined
                        }
                        onClick={() => handleComplete(session._id)}
                        className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {completingId === session._id
                          ? "Saving…"
                          : iConfirmed && !completed
                            ? "You confirmed"
                            : "Mark complete"}
                      </button>
                    </>
                  )}
                  {completed && (
                    <span className="text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
                      Session completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {scheduleModalOpen && selectedSession && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="my-sessions-schedule-title"
        >
          <div
            className="absolute inset-0"
            aria-hidden="true"
            onClick={() => {
              if (!scheduling) closeScheduleModal();
            }}
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/40 bg-white shadow-xl p-6">
            <h3
              id="my-sessions-schedule-title"
              className="text-lg font-semibold text-gray-900 mb-1"
            >
              Schedule session
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              With{" "}
              <span className="font-medium">
                {getPartnerName(selectedSession)}
              </span>{" "}
              · {getTopic(selectedSession)}
            </p>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="my-sessions-scheduled-at"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date & time <span className="text-red-500">*</span>
                </label>
                <input
                  id="my-sessions-scheduled-at"
                  type="datetime-local"
                  value={scheduledAtInput}
                  onChange={(e) => setScheduledAtInput(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400"
                  disabled={scheduling}
                />
              </div>

              {scheduleError && (
                <p className="text-sm text-red-600" role="alert">
                  {scheduleError}
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeScheduleModal}
                disabled={scheduling}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleScheduleSubmit}
                disabled={scheduling}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
              >
                {scheduling ? "Scheduling…" : "Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MySessions;
