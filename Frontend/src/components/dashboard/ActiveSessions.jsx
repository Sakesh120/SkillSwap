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

  const getTopic = (session) => {
    return session.skillRequested || session.skillsOffered || "Skill session";
  };

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
      <div className="bg-white/20 backdrop-blur-lg border-white/30  rounded-2xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Active Sessions
        </h2>

        {loading && (
          <p className="text-sm text-gray-500">Loading sessions...</p>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && activeSessions.length === 0 && (
          <p className="text-sm text-gray-500">No active sessions right now.</p>
        )}

        <div className="divide-y">
          {activeSessions.map((session) => {
            return (
              <div
                key={session._id}
                className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {getPartnerName(session)}
                    </p>
                    <p className="text-xs text-gray-500">{getTopic(session)}</p>
                    {session.status && (
                      <p className="text-xs text-indigo-600 mt-0.5 capitalize">
                        {session.status}
                        {session.scheduledAt
                          ? ` · ${new Date(session.scheduledAt).toLocaleString()}`
                          : ""}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 sm:shrink-0">
                  <button
                    type="button"
                    className="text-xs bg-gray-100 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                  >
                    Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => openScheduleModal(session)}
                    className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 cursor-pointer transition"
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
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
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

          <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/40 bg-white/95 shadow-xl backdrop-blur-md p-6">
            <h3
              id="schedule-modal-title"
              className="text-lg font-semibold text-gray-900 mb-1"
            >
              Schedule session
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              With <span className="font-medium">{getPartnerName(selectedSession)}</span>{" "}
              · {getTopic(selectedSession)}
            </p>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="scheduled-at"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date & time <span className="text-red-500">*</span>
                </label>
                <input
                  id="scheduled-at"
                  type="datetime-local"
                  value={scheduledAtInput}
                  onChange={(e) => setScheduledAtInput(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400"
                  disabled={scheduling}
                />
                <p className="text-xs text-gray-500 mt-1">
                  All fields are required to schedule.
                </p>
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
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium cursor-pointer text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleScheduleSubmit}
                disabled={scheduling}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium cursor-pointer text-white hover:bg-blue-700 transition disabled:opacity-50"
              >
                {scheduling ? "Scheduling…" : "Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ActiveSessions;
