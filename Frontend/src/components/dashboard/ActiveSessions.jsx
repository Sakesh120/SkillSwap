import { useEffect, useMemo, useState } from "react";
import {
  getSessions,
  scheduleSession as scheduleSessionApi,
} from "../../api/session.api";
import { useAuth } from "../../context/AuthContext";

function ActiveSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [scheduledAtInput, setScheduledAtInput] = useState("");
  const [scheduleError, setScheduleError] = useState(null);
  const [scheduling, setScheduling] = useState(false);

  const loadSessions = async () => {
    const res = await getSessions();
    setSessions(res.data || []);
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        await loadSessions();
      } catch (err) {
        console.error("Error fetching sessions", err);
        setError("Unable to load sessions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const activeSessions = useMemo(
    () => (sessions || []).filter((s) => s.status !== "completed"),
    [sessions],
  );

  const getPartnerName = (session) => {
    if (!user || !session.users) return "Partner";
    const partner = session.users.find((u) => u._id !== user._id);
    return partner?.name || "Partner";
  };

  const getTopic = (session) =>
    session.skillRequested || session.skillsOffered || "Skill session";

  const openScheduleModal = (session) => {
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

    if (!scheduledAtInput || !String(scheduledAtInput).trim()) {
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
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Could not schedule session.";
      setScheduleError(msg);
    } finally {
      setScheduling(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-white/30 bg-white/20 p-6 shadow-sm backdrop-blur-lg">
        <h2 className="text-fluid-h3 mb-4 font-semibold text-gray-800">
          Active Sessions
        </h2>

        {loading && <p className="text-fluid-p text-gray-500">Loading sessions...</p>}
        {error && <p className="text-fluid-p text-red-500">{error}</p>}

        {!loading && activeSessions.length === 0 && (
          <p className="text-fluid-p text-gray-500">No active sessions right now.</p>
        )}

        <div className="divide-y">
          {activeSessions.map((session) => (
            <div
              key={session._id}
              className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200"></div>

                <div>
                  <p className="text-fluid-label font-medium text-gray-800">
                    {getPartnerName(session)}
                  </p>
                  <p className="text-fluid-caption text-gray-500">
                    {getTopic(session)}
                  </p>
                  {session.status && (
                    <p className="text-fluid-caption mt-0.5 capitalize text-indigo-600">
                      {session.status}
                      {session.scheduledAt
                        ? ` | ${new Date(session.scheduledAt).toLocaleString()}`
                        : ""}
                    </p>
                  )}
                </div>
              </div>

                <div className="flex gap-2 sm:shrink-0">
                  <button
                    type="button"
                    className="text-xs bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition"
                  >
                    Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => openScheduleModal(session)}
                    className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition"
                  >
                    {session.status === "scheduled"
                      ? "Reschedule"
                      : "Schedule"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {scheduleModalOpen && selectedSession && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="schedule-modal-title"
        >
          <div
            className="absolute inset-0"
            aria-hidden="true"
            onClick={() => {
              if (!scheduling) closeScheduleModal();
            }}
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/40 bg-white/95 p-6 shadow-xl backdrop-blur-md">
            <h3
              id="schedule-modal-title"
              className="text-fluid-h3 mb-1 font-semibold text-gray-900"
            >
              Schedule session
            </h3>
            <p className="text-fluid-p mb-4 text-gray-600">
              With <span className="font-medium">{getPartnerName(selectedSession)}</span>
              {" | "}
              {getTopic(selectedSession)}
            </p>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="scheduled-at"
                  className="text-fluid-label mb-1 block font-medium text-gray-700"
                >
                  Date & time <span className="text-red-500">*</span>
                </label>
                <input
                  id="scheduled-at"
                  type="datetime-local"
                  value={scheduledAtInput}
                  onChange={(e) => setScheduledAtInput(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40"
                  disabled={scheduling}
                />
                <p className="text-fluid-caption mt-1 text-gray-500">
                  All fields are required to schedule.
                </p>
              </div>

              {scheduleError && (
                <p className="text-fluid-p text-red-600" role="alert">
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
                {scheduling ? "Scheduling..." : "Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ActiveSessions;
