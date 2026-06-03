import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, LayoutDashboard, Users, Calendar, User, Trash2, UserPlus } from 'lucide-react';
import './index.css';

const initialEmployees = [
  { id: 1, name: 'Іван', role: 'Кухня' },
  { id: 2, name: 'Ганна', role: 'Зала' },
  { id: 3, name: 'Максим', role: 'Прибирання' }
];
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
const fullWeekDays = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя'];
const monthNames = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];

export default function App() {
  const [role, setRole] = useState('manager'); // 'manager' | 'worker'
  const [employees, setEmployees] = useState(initialEmployees);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // June 2026

  const getMonthKey = (date) => `${date.getFullYear()}-${date.getMonth()}`;

  const [schedule, setSchedule] = useState({
    '2026-5': {
      1: Array(31).fill(false).map((_, i) => i % 2 === 0 ? { shift: '10:00 - 22:00', comment: 'Основна зміна' } : false),
      2: Array(31).fill(false).map((_, i) => i % 3 === 0 ? { shift: '08:00 - 16:00', comment: '' } : false),
      3: Array(31).fill(false).map((_, i) => i % 4 === 1 ? { shift: '16:00 - 00:00', comment: '' } : false),
    }
  });

  const setShift = (empId, dayIdx, value) => {
    const monthKey = getMonthKey(currentDate);
    setSchedule(prev => {
      const monthData = prev[monthKey] || {};
      const empData = monthData[empId] || Array(31).fill(false);
      const newEmpData = [...empData];
      newEmpData[dayIdx] = value;
      return {
        ...prev,
        [monthKey]: {
          ...monthData,
          [empId]: newEmpData
        }
      };
    });
  };

  const addEmployee = (name, roleName) => {
    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    setEmployees([...employees, { id: newId, name, role: roleName }]);
  };

  const removeEmployee = (id) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  const monthKey = getMonthKey(currentDate);
  const currentSchedule = schedule[monthKey] || {};

  return (
    <>
      <div className="dev-banner">
        <span>DEV SIMULATION:</span>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="manager">Менеджер (Manager)</option>
          <option value="worker">Робітник (Worker)</option>
        </select>
      </div>

      <div className="app-container">
        {role === 'manager' ? (
          <ManagerView 
            schedule={currentSchedule} 
            fullSchedule={schedule}
            getMonthKey={getMonthKey}
            setShift={setShift} 
            employees={employees}
            addEmployee={addEmployee}
            removeEmployee={removeEmployee}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
        ) : (
          <WorkerView 
            schedule={currentSchedule[1] || Array(31).fill(false)} 
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
        )}
      </div>
    </>
  );
}

function ManagerView({ schedule, fullSchedule, getMonthKey, setShift, employees, addEmployee, removeEmployee, currentDate, setCurrentDate }) {
  const [activeTab, setActiveTab] = useState('panel');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [activeCell, setActiveCell] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const calcHours = (shiftStr) => {
    if (!shiftStr) return 0;
    const [startStr, endStr] = shiftStr.split(' - ');
    if (!startStr || !endStr) return 0;
    const [sH, sM] = startStr.split(':').map(Number);
    const [eH, eM] = endStr.split(':').map(Number);
    let h = (eH + eM / 60) - (sH + sM / 60);
    if (h < 0) h += 24;
    return h;
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; 

  const handleAdd = (e) => {
    e.preventDefault();
    if (newName.trim() && newRole.trim()) {
      addEmployee(newName.trim(), newRole.trim());
      setNewName('');
      setNewRole('');
    }
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      removeEmployee(employeeToDelete.id);
      setEmployeeToDelete(null);
    }
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  return (
    <>
      <div className="top-section">
        {activeTab === 'panel' ? (
          <div className="week-selector liquid-glass">
            <button onClick={prevMonth}><ChevronLeft size={24} /></button>
            <span className="week-title">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
            <button onClick={nextMonth}><ChevronRight size={24} /></button>
          </div>
        ) : activeTab === 'staff' ? (
          <div className="greeting-panel liquid-glass" style={{ margin: 0 }}>
            <h1 style={{ fontSize: '20px' }}>Управління персоналом</h1>
            <p>Додавайте або видаляйте робітників з розкладу.</p>
          </div>
        ) : null}
      </div>

      {activeTab === 'panel' && (
        <div className="schedule-container" style={{ padding: '0 8px 24px 8px' }}>
          {!selectedEmployeeId ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 8px' }}>

              {/* ── Daily Snapshot ── */}
              {(() => {
                const todayDate = new Date();
                const dailyMonthKey = getMonthKey(todayDate);
                const dailyMonthSchedule = (fullSchedule && fullSchedule[dailyMonthKey]) || {};
                const todayIdx = todayDate.getDate() - 1;
                const workingNow = employees
                  .map(emp => ({ emp, shift: (dailyMonthSchedule[emp.id] || [])[todayIdx] }))
                  .filter(({ shift }) => !!shift);

                return (
                  <div className="liquid-glass" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                    {/* Header row with date nav */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px 8px' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-main)' }}>
                          Хто працює сьогодні
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {fullWeekDays[(todayDate.getDay() + 6) % 7]}, {todayDate.getDate()} {monthNames[todayDate.getMonth()].toLowerCase()}
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', background: 'rgba(42,171,238,0.12)', color: 'var(--tg-blue)', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' }}>
                        {workingNow.length} / {employees.length}
                      </div>
                    </div>

                    {workingNow.length === 0 ? (
                      <div style={{ padding: '12px 16px 16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Сьогодні змін не заплановано 😴
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        {workingNow.map(({ emp, shift }, i) => {
                          const [startStr, endStr] = shift.shift.split(' - ');
                          const [sHn, sMn] = startStr.split(':').map(Number);
                          const [eHn, eMn] = endStr.split(':').map(Number);
                          const startPct = ((sHn * 60 + sMn) / (24 * 60)) * 100;
                          const endPct = Math.min(((eHn * 60 + eMn) / (24 * 60)) * 100 || 100, 100);
                          const isLast = i === workingNow.length - 1;
                          return (
                            <div key={emp.id} style={{ padding: '10px 16px', borderBottom: isLast ? 'none' : '1px solid var(--glass-border)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34c759', boxShadow: '0 0 6px rgba(52,199,89,0.6)', flexShrink: 0 }} />
                                  <div>
                                    <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-main)' }}>{emp.name}</span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '6px' }}>{emp.role}</span>
                                  </div>
                                </div>
                                <div style={{ fontWeight: '600', fontSize: '13px', color: '#248a3d' }}>{shift.shift}</div>
                              </div>
                              {/* mini timeline */}
                              <div style={{ height: '3px', background: 'var(--glass-border)', borderRadius: '2px', position: 'relative' }}>
                                <div style={{ position: 'absolute', left: `${startPct}%`, width: `${endPct - startPct}%`, height: '100%', background: 'linear-gradient(90deg, #4cd964, #34c759)', borderRadius: '2px' }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ── Employee Cards ── */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '10px', paddingLeft: '4px' }}>Редагувати графік</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {employees.map(emp => {
                  const activeShiftsArr = schedule[emp.id] ? schedule[emp.id].filter(s => s !== false) : [];
                  const activeShifts = activeShiftsArr.length;
                  const totalHours = activeShiftsArr.reduce((sum, s) => {
                    if (!s.shift) return sum;
                    const [startStr, endStr] = s.shift.split(' - ');
                    if (!startStr || !endStr) return sum;
                    const [startH, startM] = startStr.split(':').map(Number);
                    const [endH, endM] = endStr.split(':').map(Number);
                    let hours = (endH + endM / 60) - (startH + startM / 60);
                    if (hours < 0) hours += 24;
                    return sum + hours;
                  }, 0);

                  return (
                    <div
                      key={emp.id}
                      className="liquid-glass-solid"
                      onClick={() => setSelectedEmployeeId(emp.id)}
                      style={{ padding: '14px 18px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-main)' }}>{emp.name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{emp.role}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <div style={{ fontSize: '12px', background: 'rgba(52, 199, 89, 0.12)', color: '#248a3d', padding: '5px 10px', borderRadius: '20px', fontWeight: '600' }}>
                          {activeShifts} змін
                        </div>
                        <div style={{ fontSize: '12px', background: 'rgba(42, 171, 238, 0.12)', color: 'var(--tg-blue)', padding: '5px 10px', borderRadius: '20px', fontWeight: '600' }}>
                          {totalHours > 0 ? totalHours.toFixed(1).replace('.0', '') : 0} годин
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            </div>
          ) : (
            <div className="schedule-table">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '0 8px', gridColumn: '1 / -1' }}>
                <button 
                  onClick={() => setSelectedEmployeeId(null)}
                  style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)', transition: 'all 0.2s' }}
                >
                  <ChevronLeft size={22} />
                </button>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '18px', color: 'var(--text-main)' }}>
                    {employees.find(e => e.id === selectedEmployeeId)?.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {employees.find(e => e.id === selectedEmployeeId)?.role}
                  </div>
                </div>
              </div>

              {/* Header Row */}
              {weekDays.map((label, idx) => (
                <div key={idx} className="header-cell liquid-glass">
                  <span>{label}</span>
                </div>
              ))}

              {/* Selected Employee Calendar */}
              {(() => {
                const emp = employees.find(e => e.id === selectedEmployeeId);
                if (!emp) return null;
                const todayDate = new Date();
                return (
                  <React.Fragment key={emp.id}>
                    {/* Empty padding cells for start of month */}
                    {Array.from({ length: startOffset }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="grid-cell" style={{ visibility: 'hidden' }}></div>
                    ))}
                    {monthDays.map((dayNum, dayIdx) => {
                      const shiftVal = schedule[emp.id] && schedule[emp.id][dayIdx];
                      const isWorking = !!shiftVal;
                      const isToday = currentDate.getFullYear() === todayDate.getFullYear() && currentDate.getMonth() === todayDate.getMonth() && dayNum === todayDate.getDate();
                      return (
                        <div key={`cell-${emp.id}-${dayIdx}`} className="grid-cell">
                          <button 
                            className={`toggle-circle ${isWorking ? 'active' : 'inactive'} ${isToday ? 'today-marker' : ''}`}
                            onClick={() => setActiveCell({ emp, dayIdx, dayNum })}
                            style={{ fontWeight: '600', color: isWorking ? '#fff' : 'var(--text-main)' }}
                          >
                            {dayNum}
                          </button>
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="staff-container" style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {employees.map(emp => (
              <div key={emp.id} className="liquid-glass-solid" style={{ padding: '16px 20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '16px' }}>{emp.name}</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{emp.role}</div>
                </div>
                <button 
                  onClick={() => setEmployeeToDelete(emp)}
                  style={{ background: 'rgba(255, 59, 48, 0.1)', border: 'none', color: '#ff3b30', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <form className="liquid-glass add-employee-form" onSubmit={handleAdd} style={{ padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--tg-blue)' }}>Додати нового робітника</h3>
            <input 
              type="text" 
              placeholder="Ім'я (напр. Олена)" 
              value={newName} 
              onChange={e => setNewName(e.target.value)}
              style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none', fontSize: '15px' }}
            />
            <input 
              type="text" 
              placeholder="Посада (напр. Бариста)" 
              value={newRole} 
              onChange={e => setNewRole(e.target.value)}
              style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none', fontSize: '15px' }}
            />
            <button type="submit" style={{ padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--tg-blue)', color: 'white', fontWeight: '600', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
              <UserPlus size={20} />
              Додати робітника
            </button>
          </form>
        </div>
      )}

      {activeTab === 'daily' && (() => {
        const dailyMonthKey = getMonthKey(selectedDailyDate);
        const dailyMonthSchedule = (fullSchedule && fullSchedule[dailyMonthKey]) || {};
        const dailyDayIdx = selectedDailyDate.getDate() - 1;
        const workingToday = employees
          .map(emp => ({ emp, shift: (dailyMonthSchedule[emp.id] || [])[dailyDayIdx] }))
          .filter(({ shift }) => !!shift);
        const offToday = employees
          .map(emp => ({ emp, shift: (dailyMonthSchedule[emp.id] || [])[dailyDayIdx] }))
          .filter(({ shift }) => !shift);

        return (
          <div style={{ padding: '0 16px 24px' }}>
            {workingToday.length === 0 ? (
              <div className="liquid-glass" style={{ padding: '32px 20px', borderRadius: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>😴</div>
                <div style={{ fontWeight: '600', fontSize: '17px', color: 'var(--text-main)' }}>Ніхто не працює</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>Змін на цей день не заплановано</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', paddingLeft: '4px' }}>
                  Працюють сьогодні · {workingToday.length} особ{workingToday.length === 1 ? 'а' : 'и'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {workingToday.map(({ emp, shift }) => {
                    const hours = calcHours(shift.shift);
                    const [startTime] = shift.shift.split(' - ');
                    const [startH] = startTime.split(':').map(Number);
                    const timeOfDay = startH < 12 ? '☀️' : startH < 17 ? '⚡' : '🌙';
                    return (
                      <div key={emp.id} className="liquid-glass-solid" style={{ borderRadius: '18px', overflow: 'hidden' }}>
                        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(52,199,89,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                              {timeOfDay}
                            </div>
                            <div>
                              <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-main)' }}>{emp.name}</div>
                              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{emp.role}</div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: '700', fontSize: '15px', color: '#248a3d' }}>{shift.shift}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{hours} годин</div>
                          </div>
                        </div>
                        {/* Timeline bar */}
                        <div style={{ height: '4px', background: 'var(--glass-border)', position: 'relative' }}>
                          {(() => {
                            const [s, e] = shift.shift.split(' - ');
                            const [sH, sM] = s.split(':').map(Number);
                            const [eH, eM] = e.split(':').map(Number);
                            const totalMins = 24 * 60;
                            const startPct = ((sH * 60 + sM) / totalMins) * 100;
                            const endPct = ((eH * 60 + eM) / totalMins) * 100 || 100;
                            return (
                              <div style={{ position: 'absolute', left: `${startPct}%`, width: `${endPct - startPct}%`, height: '100%', background: 'linear-gradient(90deg, #4cd964, #34c759)', borderRadius: '2px' }} />
                            );
                          })()}
                        </div>
                        {shift.comment ? (
                          <div style={{ padding: '8px 16px 12px', fontSize: '13px', color: 'var(--tg-blue)' }}>💬 {shift.comment}</div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {offToday.length > 0 && (
                  <>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', paddingLeft: '4px' }}>
                      Вихідний · {offToday.length} особ{offToday.length === 1 ? 'а' : 'и'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {offToday.map(({ emp }) => (
                        <div key={emp.id} className="liquid-glass" style={{ padding: '12px 16px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.6 }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>😴</div>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-main)' }}>{emp.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{emp.role} · вихідний</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        );
      })()}

      {/* Navigation tabs */}
      <div className="bottom-nav liquid-glass-solid">
        <div className={`nav-item ${activeTab === 'panel' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('panel')}>
          <div className="nav-icon"><LayoutDashboard size={22} /></div>
          <span>Графік</span>
        </div>
        <div className={`nav-item ${activeTab === 'staff' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('staff')}>
          <div className="nav-icon"><Users size={22} /></div>
          <span>Персонал</span>
        </div>
      </div>

      {activeCell && (
        <ShiftModal 
          activeCell={activeCell} 
          schedule={schedule} 
          setShift={setShift} 
          onClose={() => setActiveCell(null)} 
        />
      )}

      {employeeToDelete && (
        <div className="modal-overlay" onClick={() => setEmployeeToDelete(null)}>
          <div className="modal-content liquid-glass-solid" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text-main)' }}>Видалити працівника?</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Ви впевнені, що хочете видалити <strong>{employeeToDelete.name}</strong>? Цю дію неможливо скасувати.
            </p>
            <div className="modal-actions" style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setEmployeeToDelete(null)} className="modal-btn cancel" style={{ flex: 1, padding: '12px', borderRadius: '12px', fontWeight: '600' }}>Скасувати</button>
              <button onClick={confirmDelete} className="modal-btn" style={{ flex: 1, padding: '12px', borderRadius: '12px', fontWeight: '600', background: 'rgba(255, 59, 48, 0.1)', color: '#ff3b30' }}>Видалити</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function WorkerView({ schedule, currentDate, setCurrentDate }) {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; 

  const isWorkingSelected = schedule[selectedDayIdx];
  const dayNum = monthDays[selectedDayIdx];
  const dayLabel = fullWeekDays[(startOffset + selectedDayIdx) % 7];

  const prevMonth = () => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); setSelectedDayIdx(0); };
  const nextMonth = () => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); setSelectedDayIdx(0); };

  const activeShiftsArr = schedule.filter(s => s !== false);
  const activeShifts = activeShiftsArr.length;
  const totalHours = activeShiftsArr.reduce((sum, s) => {
    if (!s.shift) return sum;
    const [startStr, endStr] = s.shift.split(' - ');
    if (!startStr || !endStr) return sum;
    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);
    let hours = (endH + endM / 60) - (startH + startM / 60);
    if (hours < 0) hours += 24;
    return sum + hours;
  }, 0);

  return (
    <>
      <div className="greeting-panel liquid-glass" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Привіт, Іване!</h1>
          <p style={{ marginBottom: '8px' }}>Розклад на {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</p>
          <div style={{ display: 'inline-flex', fontSize: '13px', background: 'rgba(52, 199, 89, 0.15)', color: '#248a3d', padding: '6px 12px', borderRadius: '20px', fontWeight: '600', gap: '8px', alignItems: 'center' }}>
            <span>{activeShifts} {activeShifts === 1 ? 'зміна' : [2,3,4].includes(activeShifts % 10) && ![12,13,14].includes(activeShifts % 100) ? 'зміни' : 'змін'}</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>{totalHours > 0 ? totalHours.toFixed(1).replace('.0', '') + ' годин' : '0 годин'}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={prevMonth} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)', transition: 'all 0.2s' }}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)', transition: 'all 0.2s' }}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div style={{ padding: '0 16px', marginBottom: '16px' }}>
        <div className="liquid-glass-solid" style={{ borderRadius: '24px', padding: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '12px' }}>
            {weekDays.map((label, idx) => (
              <div key={idx} style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                {label}
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
            {Array.from({ length: startOffset }).map((_, idx) => (
              <div key={`empty-${idx}`} style={{ visibility: 'hidden' }}></div>
            ))}
            {(() => {
              const todayDate = new Date();
              return monthDays.map((num, idx) => {
                const isWorking = schedule[idx];
                const isSelected = selectedDayIdx === idx;
                const isToday = currentDate.getFullYear() === todayDate.getFullYear() && currentDate.getMonth() === todayDate.getMonth() && num === todayDate.getDate();
                
                let bg = isWorking ? 'rgba(52, 199, 89, 0.15)' : 'var(--glass-bg)';
                let color = isWorking ? '#248A3D' : 'var(--text-main)';
                let border = isSelected ? '2px solid var(--tg-blue)' : (isWorking ? '1px solid rgba(52, 199, 89, 0.3)' : '1px solid transparent');

                if (isSelected && isWorking) {
                   bg = 'var(--success-green)';
                   color = 'white';
                   border = '2px solid #248A3D';
                } else if (isSelected && !isWorking) {
                   bg = 'var(--tg-blue)';
                   color = 'white';
                   border = '2px solid var(--tg-blue)';
                }

                return (
                  <button
                    key={idx}
                    className={isToday ? 'today-marker' : ''}
                    onClick={() => setSelectedDayIdx(idx)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '12px',
                      border,
                      background: bg,
                      color,
                      fontWeight: '600',
                      fontSize: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      padding: 0
                    }}
                  >
                    {num}
                  </button>
                );
              });
            })()}
          </div>
        </div>
      </div>

      <div className="worker-cards" style={{ paddingTop: '0' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px', paddingLeft: '8px' }}>Деталі зміни</h3>
        <div className="worker-card liquid-glass">
          <div className="card-date">{dayLabel} {dayNum} {monthNames[currentDate.getMonth()].toLowerCase()}</div>
          <div className={`card-badge ${isWorkingSelected ? 'working' : 'off'}`}>
            {isWorkingSelected ? '🟢 РОБОЧИЙ ДЕНЬ' : '⚪ ВИХІДНИЙ'}
          </div>
          <div className="card-desc">
            {isWorkingSelected ? `Години роботи: ${isWorkingSelected.shift}` : 'Відпочинок'}
          </div>
          {isWorkingSelected && isWorkingSelected.comment && (
            <div style={{ marginTop: '12px', padding: '14px', background: 'rgba(255,255,255,0.6)', border: '1px solid var(--glass-border)', borderRadius: '12px', fontSize: '14px', color: 'var(--tg-blue)', fontWeight: '500' }}>
              💬 {isWorkingSelected.comment}
            </div>
          )}
        </div>
      </div>

      <div className="bottom-nav liquid-glass-solid">
        <div className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
          <div className="nav-icon"><Calendar size={22} /></div>
          <span>Мій графік</span>
        </div>
        <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <div className="nav-icon"><User size={22} /></div>
          <span>Профіль</span>
        </div>
      </div>
    </>
  );
}

function ShiftModal({ activeCell, schedule, setShift, onClose }) {
  const currentVal = schedule[activeCell.emp.id] && schedule[activeCell.emp.id][activeCell.dayIdx];
  const [shiftStart, setShiftStart] = useState(currentVal ? currentVal.shift.split(' - ')[0] : '10:00');
  const [shiftEnd, setShiftEnd] = useState(currentVal ? currentVal.shift.split(' - ')[1] : '22:00');
  const [comment, setComment] = useState(currentVal ? currentVal.comment : '');
  const [isWorking, setIsWorking] = useState(!!currentVal);

  const applyPreset = (start, end) => {
    setIsWorking(true);
    setShiftStart(start);
    setShiftEnd(end);
  };

  const handleSave = () => {
    if (!isWorking) {
      setShift(activeCell.emp.id, activeCell.dayIdx, false);
    } else {
      setShift(activeCell.emp.id, activeCell.dayIdx, { shift: `${shiftStart} - ${shiftEnd}`, comment });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content liquid-glass-solid" onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: '18px', marginBottom: '4px', color: 'var(--text-main)' }}>Налаштування зміни</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          {activeCell.emp.name}, {activeCell.dayNum}
        </p>

        {/* Presets - Liquid Glass Style */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <button onClick={() => setIsWorking(false)} style={{ background: !isWorking ? 'rgba(255,59,48,0.1)' : 'var(--glass-bg)', border: !isWorking ? '1px solid rgba(255,59,48,0.3)' : '1px solid var(--glass-border)', color: !isWorking ? '#ff3b30' : 'var(--text-main)', padding: '14px 16px', borderRadius: '12px', fontWeight: '500', fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '18px' }}>⚪</span> Вихідний
          </button>
          <button onClick={() => applyPreset('08:00', '16:00')} style={{ background: isWorking && shiftStart === '08:00' ? 'rgba(52,199,89,0.1)' : 'var(--glass-bg)', border: isWorking && shiftStart === '08:00' ? '1px solid rgba(52,199,89,0.3)' : '1px solid var(--glass-border)', color: isWorking && shiftStart === '08:00' ? '#248a3d' : 'var(--text-main)', padding: '14px 16px', borderRadius: '12px', fontWeight: '500', fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '18px' }}>☀️</span> Ранкова (08:00 - 16:00)
          </button>
          <button onClick={() => applyPreset('10:00', '22:00')} style={{ background: isWorking && shiftStart === '10:00' ? 'rgba(42,171,238,0.1)' : 'var(--glass-bg)', border: isWorking && shiftStart === '10:00' ? '1px solid rgba(42,171,238,0.3)' : '1px solid var(--glass-border)', color: isWorking && shiftStart === '10:00' ? 'var(--tg-blue)' : 'var(--text-main)', padding: '14px 16px', borderRadius: '12px', fontWeight: '500', fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '18px' }}>⚡</span> Повна (10:00 - 22:00)
          </button>
          <button onClick={() => applyPreset('16:00', '00:00')} style={{ background: isWorking && shiftStart === '16:00' ? 'rgba(88,86,214,0.1)' : 'var(--glass-bg)', border: isWorking && shiftStart === '16:00' ? '1px solid rgba(88,86,214,0.3)' : '1px solid var(--glass-border)', color: isWorking && shiftStart === '16:00' ? '#5856D6' : 'var(--text-main)', padding: '14px 16px', borderRadius: '12px', fontWeight: '500', fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '18px' }}>🌙</span> Вечірня (16:00 - 00:00)
          </button>
        </div>

        {isWorking && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Початок</label>
                <input type="time" value={shiftStart} onChange={e => setShiftStart(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.7)', outline: 'none', color: 'var(--text-main)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Кінець</label>
                <input type="time" value={shiftEnd} onChange={e => setShiftEnd(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.7)', outline: 'none', color: 'var(--text-main)' }} />
              </div>
            </div>
            
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Коментар (опціонально)</label>
              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Наприклад: 'Видача замовлень' або 'Прибирання залу'" style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.7)', outline: 'none', resize: 'vertical', minHeight: '60px', fontSize: '14px', color: 'var(--text-main)' }} />
            </div>
          </div>
        )}

        <div className="modal-actions" style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={onClose}
            style={{ flex: 1, padding: '14px', borderRadius: '14px', fontWeight: '600', fontSize: '15px', border: 'none', background: 'var(--gray-light)', color: 'var(--text-main)', cursor: 'pointer' }}
          >
            Скасувати
          </button>
          <button 
            onClick={handleSave}
            style={{ flex: 1, padding: '14px', borderRadius: '14px', fontWeight: '600', fontSize: '15px', border: 'none', background: 'var(--tg-blue)', color: 'white', cursor: 'pointer' }}
          >
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
}
