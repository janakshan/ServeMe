import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { useServiceTheme, useThemedStyles } from "@/contexts/ServiceThemeContext";
import { EducationHeader, EducationScreenHeader } from "@/src/education/components/headers";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MOCK_LIVE_CLASSES = [
  {
    id: "1",
    title: "O/L Mathematics - Algebra Problem Solving",
    instructor: "Ravi Shankar",
    subject: "Mathematics",
    date: "2025-07-22",
    time: "10:00 AM",
    duration: "2 hours",
    status: "upcoming",
    studentsCount: 85,
    maxStudents: 100,
    description: "Interactive session on solving complex algebra problems for O/L examination.",
    isRegistered: true,
  },
  {
    id: "2",
    title: "A/L Biology - Human Physiology",
    instructor: "Dr. Priya Rajendran",
    subject: "Science",
    date: "2025-07-18",
    time: "2:00 PM",
    duration: "1.5 hours",
    status: "live",
    studentsCount: 68,
    maxStudents: 75,
    description: "Live demonstration of human circulatory and respiratory systems.",
    isRegistered: true,
  },
  {
    id: "3",
    title: "Tamil Literature - Modern Poetry Analysis",
    instructor: "Suresh Kandasamy",
    subject: "Languages",
    date: "2025-07-25",
    time: "11:00 AM",
    duration: "2 hours",
    status: "upcoming",
    studentsCount: 45,
    maxStudents: 50,
    description: "Analysis of modern Tamil poetry for O/L and A/L students.",
    isRegistered: false,
  },
  {
    id: "4",
    title: "Sri Lankan History - Colonial Period",
    instructor: "Prof. Mythili Rajasingam",
    subject: "Social Studies",
    date: "2025-08-02",
    time: "4:00 PM",
    duration: "2 hours",
    status: "upcoming",
    studentsCount: 92,
    maxStudents: 120,
    description: "Comprehensive review of Sri Lankan colonial history for O/L students.",
    isRegistered: true,
  },
  {
    id: "5",
    title: "A/L Physics - Mechanics and Motion",
    instructor: "Dr. Krishnan Nadarajah",
    subject: "Science",
    date: "2025-08-05",
    time: "9:00 AM",
    duration: "2.5 hours",
    status: "upcoming",
    studentsCount: 55,
    maxStudents: 60,
    description: "Advanced mechanics concepts with practical problem-solving for A/L Physics.",
    isRegistered: false,
  },
  {
    id: "6",
    title: "O/L Science - Chemistry Practicals",
    instructor: "Dr. Kamala Thanabalasingham",
    subject: "Science",
    date: "2025-07-15",
    time: "3:00 PM",
    duration: "1.5 hours",
    status: "completed",
    studentsCount: 72,
    maxStudents: 80,
    description: "Virtual chemistry laboratory session for O/L Science students.",
    isRegistered: true,
  },
  {
    id: "7",
    title: "English Language - Essay Writing Techniques",
    instructor: "Geetha Mahendran",
    subject: "Languages",
    date: "2025-07-10",
    time: "1:00 PM",
    duration: "2 hours",
    status: "completed",
    studentsCount: 110,
    maxStudents: 120,
    description: "Advanced essay writing techniques for O/L and A/L English examinations.",
    isRegistered: false,
  },
  {
    id: "8",
    title: "A/L Combined Mathematics - Calculus",
    instructor: "Prof. Murugesan Sivasubramaniam",
    subject: "Mathematics",
    date: "2025-08-12",
    time: "10:00 AM",
    duration: "3 hours",
    status: "upcoming",
    studentsCount: 48,
    maxStudents: 50,
    description: "Advanced calculus concepts and applications for A/L Mathematics stream.",
    isRegistered: true,
  },
];

const STATUS_FILTERS = ["All", "Live", "Upcoming", "Completed"];
const TABS = ["All Classes", "My Classes"];

interface LiveClassCardProps {
  liveClass: any;
  onPress: (classId: string) => void;
}

const LiveClassCard: React.FC<LiveClassCardProps> = ({ liveClass, onPress }) => {
  const styles = useThemedStyles(createClassCardStyles);
  const { tokens } = useServiceTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return tokens.colors.error;
      case "upcoming":
        return tokens.colors.primary;
      case "completed":
        return tokens.colors.success;
      default:
        return tokens.colors.onSurfaceVariant;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "🔴 Live Now";
      case "upcoming":
        return "📅 Upcoming";
      case "completed":
        return "✅ Completed";
      default:
        return status;
    }
  };

  const getActionButton = () => {
    if (liveClass.status === "live") {
      return (
        <TouchableOpacity style={[styles.actionButton, styles.joinButton]}>
          <Text style={styles.joinButtonText}>Join Now</Text>
        </TouchableOpacity>
      );
    }
    
    if (liveClass.status === "upcoming") {
      return liveClass.isRegistered ? (
        <TouchableOpacity style={[styles.actionButton, styles.registeredButton]}>
          <Ionicons name="checkmark" size={16} color={tokens.colors.success} />
          <Text style={styles.registeredButtonText}>Registered</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.actionButton, styles.registerButton]}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      );
    }
    
    if (liveClass.status === "completed") {
      return (
        <TouchableOpacity style={[styles.actionButton, styles.watchButton]}>
          <Ionicons name="play" size={16} color={tokens.colors.primary} />
          <Text style={styles.watchButtonText}>Watch Recording</Text>
        </TouchableOpacity>
      );
    }
    
    return null;
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(liveClass.id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.statusBadge}>
          <Text style={[styles.statusText, { color: getStatusColor(liveClass.status) }]}>
            {getStatusText(liveClass.status)}
          </Text>
        </View>
        <View style={styles.rightBadges}>
          {liveClass.isRegistered && (
            <View style={styles.subscriptionBadge}>
              <Ionicons name="bookmark" size={14} color={tokens.colors.primary} />
            </View>
          )}
          <View style={styles.subjectBadge}>
            <Text style={styles.subjectText}>{liveClass.subject}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.title}>{liveClass.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {liveClass.description}
      </Text>

      <View style={styles.instructorRow}>
        <Ionicons name="person" size={16} color={tokens.colors.onSurfaceVariant} />
        <Text style={styles.instructor}>{liveClass.instructor}</Text>
      </View>

      <View style={styles.timeRow}>
        <View style={styles.timeItem}>
          <Ionicons name="calendar" size={16} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.timeText}>{liveClass.date}</Text>
        </View>
        <View style={styles.timeItem}>
          <Ionicons name="time" size={16} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.timeText}>{liveClass.time}</Text>
        </View>
        <View style={styles.timeItem}>
          <Ionicons name="hourglass" size={16} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.timeText}>{liveClass.duration}</Text>
        </View>
      </View>

      <View style={styles.studentsRow}>
        <View style={styles.studentsInfo}>
          <Ionicons name="people" size={16} color={tokens.colors.onSurfaceVariant} />
          <Text style={styles.studentsText}>
            {liveClass.studentsCount}/{liveClass.maxStudents} students
          </Text>
        </View>
        <View style={styles.studentsProgress}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(liveClass.studentsCount / liveClass.maxStudents) * 100}%`,
                  backgroundColor: tokens.colors.primary,
                },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        {getActionButton()}
      </View>
    </TouchableOpacity>
  );
};

// Calendar Modal Component
const CalendarModal = ({ visible, onClose, classes, tokens }) => {
  const styles = useThemedStyles(createCalendarStyles);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [calendarView, setCalendarView] = useState('month'); // 'day', 'week', 'month'
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  // Initialize selectedDate when modal becomes visible
  React.useEffect(() => {
    if (visible && !selectedDate) {
      const today = new Date();
      setSelectedDate(today);
      setSelectedWeek(today);
      setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    }
  }, [visible, selectedDate]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };


  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getClassesForDate = (date) => {
    if (!date) return [];
    const dateString = formatDate(date);
    return classes.filter(cls => cls.date === dateString);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "live":
        return tokens.colors.error;
      case "upcoming":
        return tokens.colors.primary;
      case "completed":
        return tokens.colors.success;
      default:
        return tokens.colors.onSurfaceVariant;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "live":
        return "radio-button-on";
      case "upcoming":
        return "calendar";
      case "completed":
        return "checkmark-circle";
      default:
        return "help-circle";
    }
  };

  // Handle view change and sync dates
  const handleViewChange = (newView: string) => {
    const currentDate = selectedDate || new Date();
    
    setCalendarView(newView);
    
    if (newView === 'day') {
      // When switching to day view, use the selected date or today
      if (!selectedDate) {
        setSelectedDate(new Date());
      }
    } else if (newView === 'week') {
      // When switching to week view, set the week that contains the selected date
      setSelectedWeek(currentDate);
    } else if (newView === 'month') {
      // When switching to month view, update current month to show the selected date's month
      if (selectedDate) {
        setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
      }
    }
  };

  // Helper functions for day and week views
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 22; hour++) {
      slots.push({
        hour,
        time: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
        fullTime: `${hour.toString().padStart(2, '0')}:00`
      });
    }
    return slots;
  };

  const parseTime = (timeString) => {
    // Parse time like "10:00 AM" to hours (24-hour format)
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;
    return hour24 + minutes / 60;
  };

  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const navigateDate = (direction) => {
    if (calendarView === 'day') {
      const newDate = new Date(selectedDate || new Date());
      newDate.setDate(newDate.getDate() + direction);
      setSelectedDate(newDate);
      // Also update the week state to keep views in sync
      setSelectedWeek(newDate);
      // Update current month if we moved to a different month
      if (newDate.getMonth() !== currentMonth.getMonth() || newDate.getFullYear() !== currentMonth.getFullYear()) {
        setCurrentMonth(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
      }
    } else if (calendarView === 'week') {
      const newWeek = new Date(selectedWeek);
      newWeek.setDate(selectedWeek.getDate() + (direction * 7));
      setSelectedWeek(newWeek);
      // Update selected date to the first day of the new week (or keep current day of week)
      const currentDayOfWeek = selectedDate ? selectedDate.getDay() : 0;
      const newSelectedDate = new Date(newWeek);
      newSelectedDate.setDate(newWeek.getDate() - newWeek.getDay() + currentDayOfWeek);
      setSelectedDate(newSelectedDate);
      // Update current month if we moved to a different month
      if (newWeek.getMonth() !== currentMonth.getMonth() || newWeek.getFullYear() !== currentMonth.getFullYear()) {
        setCurrentMonth(new Date(newWeek.getFullYear(), newWeek.getMonth(), 1));
      }
    } else {
      navigateMonth(direction);
    }
  };

  const renderDayView = () => {
    const currentDate = selectedDate || new Date();
    const dayClasses = getClassesForDate(currentDate);
    const timeSlots = getTimeSlots();

    return (
      <View style={styles.dayViewContainer}>
        <View style={styles.dayViewHeader}>
          <TouchableOpacity onPress={() => navigateDate(-1)} style={styles.dayNavButton}>
            <Ionicons name="chevron-back" size={24} color={tokens.colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.dayViewDateContainer}>
            <Text style={styles.dayViewDate}>
              {currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigateDate(1)} style={styles.dayNavButton}>
            <Ionicons name="chevron-forward" size={24} color={tokens.colors.onSurface} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.dayViewScrollContainer} showsVerticalScrollIndicator={false}>
          {timeSlots.map((slot) => {
            const slotClasses = dayClasses.filter(cls => {
              const classTime = parseTime(cls.time);
              return Math.floor(classTime) === slot.hour;
            });

            return (
              <View key={slot.hour} style={styles.timeSlotContainer}>
                <View style={styles.timeSlotHeader}>
                  <Text style={styles.timeSlotText}>{slot.time}</Text>
                </View>
                <View style={styles.timeSlotContent}>
                  {slotClasses.length === 0 ? (
                    <View style={styles.emptyTimeSlot} />
                  ) : (
                    slotClasses.map((cls) => (
                      <View key={cls.id} style={styles.dayClassItem}>
                        <View style={styles.dayClassHeader}>
                          <Ionicons 
                            name={getStatusIcon(cls.status)}
                            size={16}
                            color={getStatusColor(cls.status)}
                          />
                          <View style={[styles.statusChip, { backgroundColor: getStatusColor(cls.status) + '20' }]}>
                            <Text style={[styles.statusChipText, { color: getStatusColor(cls.status) }]}>
                              {cls.status}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.dayClassTitle} numberOfLines={2}>{cls.title}</Text>
                        <Text style={styles.dayClassInstructor}>{cls.instructor}</Text>
                        <Text style={styles.dayClassTime}>{cls.time} • {cls.duration}</Text>
                      </View>
                    ))
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderWeekView = () => {
    const weekDates = getWeekDates(selectedWeek);
    const timeSlots = getTimeSlots();

    return (
      <View style={styles.weekViewContainer}>
        <View style={styles.weekViewHeader}>
          <TouchableOpacity onPress={() => navigateDate(-1)} style={styles.weekNavButton}>
            <Ionicons name="chevron-back" size={24} color={tokens.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.weekViewTitle}>
            {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => navigateDate(1)} style={styles.weekNavButton}>
            <Ionicons name="chevron-forward" size={24} color={tokens.colors.onSurface} />
          </TouchableOpacity>
        </View>

        <View style={styles.weekDaysHeader}>
          {weekDates.map((date, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.weekDayColumn}
              onPress={() => {
                setSelectedDate(date);
                setSelectedWeek(date); // Keep week in sync
                setCalendarView('day');
              }}
            >
              <Text style={styles.weekDayName}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </Text>
              <Text style={[
                styles.weekDayNumber,
                formatDate(date) === formatDate(new Date()) && styles.todayWeekDay
              ]}>
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.weekViewScrollContainer} showsVerticalScrollIndicator={false}>
          {timeSlots.map((slot) => (
            <View key={slot.hour} style={styles.weekTimeSlotContainer}>
              <View style={styles.weekTimeSlotHeader}>
                <Text style={styles.weekTimeSlotText}>{slot.time}</Text>
              </View>
              <View style={styles.weekTimeSlotContent}>
                {weekDates.map((date, dayIndex) => {
                  const dayClasses = getClassesForDate(date).filter(cls => {
                    const classTime = parseTime(cls.time);
                    return Math.floor(classTime) === slot.hour;
                  });

                  return (
                    <View key={dayIndex} style={styles.weekDayTimeSlot}>
                      {dayClasses.map((cls) => (
                        <View key={cls.id} style={styles.weekClassItem}>
                          <Text style={styles.weekClassTitle} numberOfLines={1}>{cls.title}</Text>
                          <Text style={styles.weekClassTime}>{cls.time}</Text>
                        </View>
                      ))}
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderCalendarDay = (date, index) => {
    if (!date) {
      return <View key={index} style={styles.emptyDay} />;
    }

    const dayClasses = getClassesForDate(date);
    const liveClasses = dayClasses.filter(cls => cls.status === "live");
    const upcomingClasses = dayClasses.filter(cls => cls.status === "upcoming");
    const completedClasses = dayClasses.filter(cls => cls.status === "completed");
    const isSelected = selectedDate && formatDate(selectedDate) === formatDate(date);
    const isToday = formatDate(date) === formatDate(new Date());

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.calendarDay,
          isSelected && styles.selectedDay,
          isToday && styles.todayDay,
        ]}
        onPress={() => {
          setSelectedDate(date);
          // Also update the week state to include this date's week
          setSelectedWeek(date);
        }}
      >
        <Text style={[
          styles.dayNumber,
          isSelected && styles.selectedDayNumber,
          isToday && styles.todayDayNumber,
        ]}>
          {date.getDate()}
        </Text>
        
        {dayClasses.length > 0 && (
          <View style={styles.dayIndicators}>
            {liveClasses.length > 0 && (
              <View style={[styles.dayIndicator, { backgroundColor: tokens.colors.error }]} />
            )}
            {upcomingClasses.length > 0 && (
              <View style={[styles.dayIndicator, { backgroundColor: tokens.colors.primary }]} />
            )}
            {completedClasses.length > 0 && (
              <View style={[styles.dayIndicator, { backgroundColor: tokens.colors.success }]} />
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderSelectedDateClasses = () => {
    if (!selectedDate) return null;
    
    const dayClasses = getClassesForDate(selectedDate);
    if (dayClasses.length === 0) return null;

    return (
      <View style={styles.selectedDateContainer}>
        <Text style={styles.selectedDateTitle}>
          {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
        <ScrollView style={styles.classesScrollView}>
          {dayClasses.map((cls) => (
            <View key={cls.id} style={styles.classItem}>
              <View style={styles.classHeader}>
                <Ionicons 
                  name={getStatusIcon(cls.status)}
                  size={16}
                  color={getStatusColor(cls.status)}
                />
                <Text style={styles.classTime}>{cls.time}</Text>
                <View style={[styles.statusChip, { backgroundColor: getStatusColor(cls.status) + '20' }]}>
                  <Text style={[styles.statusChipText, { color: getStatusColor(cls.status) }]}>
                    {cls.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.classTitle} numberOfLines={1}>{cls.title}</Text>
              <Text style={styles.classInstructor}>{cls.instructor}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
    setSelectedDate(null); // Reset selected date when month changes
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 2; i <= currentYear + 2; i++) {
    years.push(i);
  }

  const handleMonthSelect = (monthIndex) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(monthIndex);
    setCurrentMonth(newMonth);
    setSelectedDate(null); // Reset selected date when month changes
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year) => {
    const newMonth = new Date(currentMonth);
    newMonth.setFullYear(year);
    setCurrentMonth(newMonth);
    setSelectedDate(null); // Reset selected date when year changes
    setShowYearPicker(false);
  };

  const renderMonthPicker = () => {
    if (!showMonthPicker) return null;
    
    return (
      <View style={styles.pickerOverlay}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Month</Text>
            <TouchableOpacity onPress={() => setShowMonthPicker(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={tokens.colors.onSurface} />
            </TouchableOpacity>
          </View>
          <View style={styles.monthGrid}>
            {months.map((month, index) => (
              <TouchableOpacity
                key={month}
                style={[
                  styles.monthGridItem,
                  index === currentMonth.getMonth() && styles.monthGridItemSelected
                ]}
                onPress={() => handleMonthSelect(index)}
              >
                <Text style={[
                  styles.monthGridItemText,
                  index === currentMonth.getMonth() && styles.monthGridItemTextSelected
                ]}>
                  {month.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderYearPicker = () => {
    if (!showYearPicker) return null;
    
    return (
      <View style={styles.pickerOverlay}>
        <View style={styles.yearPickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Year</Text>
            <TouchableOpacity onPress={() => setShowYearPicker(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={tokens.colors.onSurface} />
            </TouchableOpacity>
          </View>
          <View style={styles.yearGrid}>
            {years.map((year) => (
              <TouchableOpacity
                key={year}
                style={[
                  styles.yearGridItem,
                  year === currentMonth.getFullYear() && styles.yearGridItemSelected
                ]}
                onPress={() => handleYearSelect(year)}
              >
                <Text style={[
                  styles.yearGridItemText,
                  year === currentMonth.getFullYear() && styles.yearGridItemTextSelected
                ]}>
                  {year}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Class Schedule</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={tokens.colors.onSurface} />
          </TouchableOpacity>
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: tokens.colors.error }]} />
            <Text style={styles.legendText}>Live</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: tokens.colors.primary }]} />
            <Text style={styles.legendText}>Upcoming</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: tokens.colors.success }]} />
            <Text style={styles.legendText}>Completed</Text>
          </View>
        </View>

        {/* View Selector */}
        <View style={styles.viewSelectorContainer}>
          {['Day', 'Week', 'Month'].map((view) => (
            <TouchableOpacity
              key={view}
              style={[
                styles.viewSelectorButton,
                calendarView === view.toLowerCase() && styles.viewSelectorButtonActive
              ]}
              onPress={() => handleViewChange(view.toLowerCase())}
            >
              <Text style={[
                styles.viewSelectorText,
                calendarView === view.toLowerCase() && styles.viewSelectorTextActive
              ]}>
                {view}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Calendar Content */}
        {calendarView === 'day' && renderDayView()}
        {calendarView === 'week' && renderWeekView()}
        {calendarView === 'month' && (
          <View style={styles.calendarContainer}>
            <View style={styles.monthHeader}>
              <TouchableOpacity onPress={() => navigateMonth(-1)} style={styles.monthNavButton}>
                <Ionicons name="chevron-back" size={24} color={tokens.colors.onSurface} />
              </TouchableOpacity>
              <View style={styles.monthYearContainer}>
                <TouchableOpacity onPress={() => setShowMonthPicker(true)} style={styles.monthYearButton}>
                  <Text style={styles.monthText}>
                    {currentMonth.toLocaleDateString('en-US', { month: 'long' })}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={tokens.colors.onSurface} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowYearPicker(true)} style={styles.monthYearButton}>
                  <Text style={styles.yearText}>
                    {currentMonth.getFullYear()}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={tokens.colors.onSurface} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => navigateMonth(1)} style={styles.monthNavButton}>
                <Ionicons name="chevron-forward" size={24} color={tokens.colors.onSurface} />
              </TouchableOpacity>
            </View>

            <View style={styles.weekDaysContainer}>
              {weekDays.map((day) => (
                <View key={day} style={styles.weekDayCell}>
                  <Text style={styles.weekDayText}>{day}</Text>
                </View>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {days.map((date, index) => renderCalendarDay(date, index))}
            </View>
          </View>
        )}

        {calendarView === 'month' && renderSelectedDateClasses()}
        {calendarView === 'month' && renderMonthPicker()}
        {calendarView === 'month' && renderYearPicker()}
      </View>
    </Modal>
  );
};

export default function LiveClassesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("All Classes");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const styles = useThemedStyles(createStyles);
  const { tokens, getGradient } = useServiceTheme();

  const filteredClasses = MOCK_LIVE_CLASSES.filter(liveClass => {
    const matchesSearch = liveClass.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         liveClass.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         liveClass.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    // First filter by tab (All Classes vs My Classes)
    let matchesTab = true;
    if (selectedTab === "My Classes") {
      matchesTab = liveClass.isRegistered === true;
    }
    
    // Then filter by status within the tab
    let matchesFilter = true;
    if (selectedFilter !== "All") {
      matchesFilter = liveClass.status === selectedFilter.toLowerCase();
    }
    
    return matchesSearch && matchesTab && matchesFilter;
  });

  const handleClassPress = (classId: string) => {
    Alert.alert(
      "Live Class",
      "Class details and interaction features will be implemented soon!",
      [{ text: "OK" }]
    );
  };

  const handleCalendarPress = () => {
    setCalendarVisible(true);
  };

  const handleCloseCalendar = () => {
    setCalendarVisible(false);
  };

  const handleFilterToggle = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  // Group classes by date
  const getClassesForDate = (date: string) => {
    return MOCK_LIVE_CLASSES.filter(cls => cls.date === date);
  };

  // Get unique dates from classes
  const getUniqueDates = () => {
    const dates = [...new Set(MOCK_LIVE_CLASSES.map(cls => cls.date))];
    return dates.sort();
  };

  const liveClassesCount = MOCK_LIVE_CLASSES.filter(c => c.status === "live").length;
  const upcomingClassesCount = MOCK_LIVE_CLASSES.filter(c => c.status === "upcoming").length;

  // Create a subtle gradient background that transitions from header
  const backgroundGradient = getGradient('background');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={backgroundGradient.colors as any}
        start={{ x: backgroundGradient.direction.x, y: backgroundGradient.direction.y }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <EducationScreenHeader
          title="Live Classes"
          // subtitle="Join live sessions with expert teachers"
          minHeight={240}
          rightActions={[
            {
              icon: "options-outline",
              onPress: handleFilterToggle,
            },
            {
              icon: "calendar",
              onPress: handleCalendarPress,
            }
          ]}
        />
        
        <View style={styles.contentWrapper}>
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  selectedTab === tab && styles.tabButtonActive
                ]}
                onPress={() => setSelectedTab(tab)}
              >
                <Text style={[
                  styles.tabText,
                  selectedTab === tab && styles.tabTextActive
                ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {isFilterVisible && (
            <EducationHeader
              variant="live-classes"
              search={{
                value: searchQuery,
                onChangeText: setSearchQuery,
                placeholder: "Search classes...",
              }}
              filters={{
                options: STATUS_FILTERS.map((filter) => ({
                  id: filter,
                  label: filter,
                  value: filter,
                })),
                selectedValue: selectedFilter,
                onSelect: setSelectedFilter,
              }}
              section={{
                title: selectedFilter === "All" ? selectedTab : 
                       `${selectedFilter} Classes`,
                count: filteredClasses.length,
                countLabel: selectedTab === "My Classes" ? "subscribed classes" : "classes",
              }}
            />
          )}
          
          {!isFilterVisible && (
            <View style={styles.simpleHeader}>
              <Text style={styles.simpleHeaderTitle}>
                {selectedFilter === "All" ? selectedTab : 
                 `${selectedFilter} Classes`}
              </Text>
              <Text style={styles.simpleHeaderCount}>
                {filteredClasses.length} {selectedTab === "My Classes" ? "subscribed classes" : "classes"}
              </Text>
            </View>
          )}

          <ScrollView
            style={styles.classesContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >

            {filteredClasses.map((liveClass) => (
              <LiveClassCard
                key={liveClass.id}
                liveClass={liveClass}
                onPress={handleClassPress}
              />
            ))}
            
            {/* Bottom spacing for tab bar */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </View>
      </LinearGradient>

      <CalendarModal
        visible={calendarVisible}
        onClose={handleCloseCalendar}
        classes={MOCK_LIVE_CLASSES}
        tokens={tokens}
      />
    </View>
  );
}

const createStyles = (tokens: any) => {
  const getSoftTintedColors = () => {
    const primaryColor = tokens.colors.primary;

    if (primaryColor === "#6A1B9A") {
      // Purple theme - soft purple tints
      return {
        softBackground: "#FDFAFF", // Very light purple tint
        softSurface: "#F9F2FF", // Light purple tint
      };
    } else if (primaryColor === "#0D47A1") {
      // Professional blue theme - soft blue tints
      return {
        softBackground: "#F8FAFE", // Very light blue tint
        softSurface: "#F0F6FF", // Light blue tint for cards/surfaces
      };
    } else if (primaryColor === "#2E7D32") {
      // Green theme - soft green tints
      return {
        softBackground: "#F9FDF9", // Very light green tint
        softSurface: "#F2F8F2", // Light green tint
      };
    } else if (primaryColor === "#E91E63") {
      // Pink theme - soft pink tints
      return {
        softBackground: "#FFFAFC", // Very light pink tint
        softSurface: "#FFF2F7", // Light pink tint
      };
    } else {
      // Default soft blue tints
      return {
        softBackground: "#F8FAFE",
        softSurface: "#F0F6FF",
      };
    }
  };

  const backgroundColors = getSoftTintedColors();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    gradientBackground: {
      flex: 1,
    },
    contentWrapper: {
      flex: 1,
      backgroundColor: backgroundColors.softSurface,
      marginTop: -tokens.spacing.lg, // Overlap with header for smooth transition
      borderTopLeftRadius: tokens.borderRadius.xl,
      borderTopRightRadius: tokens.borderRadius.xl,
    },
    classesContainer: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    scrollContent: {
      paddingHorizontal: tokens.spacing.md,
      paddingTop: tokens.spacing.xs,
      backgroundColor: 'transparent',
    },
    bottomSpacing: {
      height: 100, // Space for tab bar
    },
    simpleHeader: {
      paddingHorizontal: tokens.spacing.lg,
      paddingTop: tokens.spacing.lg,
      paddingBottom: tokens.spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border + '20',
    },
    simpleHeaderTitle: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
    },
    simpleHeaderCount: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      fontWeight: '500',
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: tokens.colors.surface,
      marginHorizontal: tokens.spacing.md,
      marginTop: tokens.spacing.md,
      borderRadius: tokens.borderRadius.md,
      padding: 4,
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    tabButton: {
      flex: 1,
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.md,
      borderRadius: tokens.borderRadius.sm,
      alignItems: 'center',
    },
    tabButtonActive: {
      backgroundColor: tokens.colors.primary,
    },
    tabText: {
      fontSize: tokens.typography.body,
      fontWeight: '500',
      color: tokens.colors.onSurfaceVariant,
    },
    tabTextActive: {
      color: tokens.colors.onPrimary,
      fontWeight: '600',
    },
  });
};

const createClassCardStyles = (tokens: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.md,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.md,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      ...tokens.shadows.sm,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: tokens.spacing.sm,
    },
    statusBadge: {
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 4,
      borderRadius: tokens.borderRadius.sm,
      backgroundColor: tokens.colors.surfaceVariant,
    },
    statusText: {
      fontSize: tokens.typography.caption,
      fontWeight: "600",
    },
    rightBadges: {
      flexDirection: "row",
      alignItems: "center",
    },
    subscriptionBadge: {
      backgroundColor: tokens.colors.primaryContainer,
      paddingHorizontal: tokens.spacing.xs,
      paddingVertical: 4,
      borderRadius: tokens.borderRadius.sm,
      marginRight: tokens.spacing.xs,
      borderWidth: 1,
      borderColor: tokens.colors.primary,
    },
    subjectBadge: {
      backgroundColor: tokens.colors.primaryLight,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 4,
      borderRadius: tokens.borderRadius.sm,
    },
    subjectText: {
      fontSize: tokens.typography.caption,
      color: "#FFFFFF",
      fontWeight: "600",
    },
    title: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
    },
    description: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      marginBottom: tokens.spacing.md,
    },
    instructorRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: tokens.spacing.sm,
    },
    instructor: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      marginLeft: tokens.spacing.xs,
    },
    timeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: tokens.spacing.md,
    },
    timeItem: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    timeText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginLeft: tokens.spacing.xs,
    },
    studentsRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: tokens.spacing.md,
    },
    studentsInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: tokens.spacing.md,
    },
    studentsText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginLeft: tokens.spacing.xs,
    },
    studentsProgress: {
      flex: 1,
    },
    progressBar: {
      height: 4,
      backgroundColor: tokens.colors.surfaceVariant,
      borderRadius: tokens.borderRadius.sm,
    },
    progressFill: {
      height: "100%",
      borderRadius: tokens.borderRadius.sm,
    },
    actionRow: {
      alignItems: "flex-end",
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.md,
    },
    joinButton: {
      backgroundColor: tokens.colors.error,
    },
    joinButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onPrimary,
      fontWeight: "600",
    },
    registerButton: {
      backgroundColor: tokens.colors.primary,
    },
    registerButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onPrimary,
      fontWeight: "600",
    },
    registeredButton: {
      backgroundColor: tokens.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: tokens.colors.success,
    },
    registeredButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.success,
      fontWeight: "600",
      marginLeft: tokens.spacing.xs,
    },
    watchButton: {
      backgroundColor: tokens.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: tokens.colors.primary,
    },
    watchButtonText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.primary,
      fontWeight: "600",
      marginLeft: tokens.spacing.xs,
    },
  });

const createCalendarStyles = (tokens: any) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: tokens.colors.surface,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: tokens.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
    },
    modalTitle: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
    },
    legendContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surfaceVariant,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: tokens.spacing.sm,
    },
    legendText: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
    },
    calendarContainer: {
      backgroundColor: tokens.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
    },
    monthHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surfaceVariant,
    },
    monthNavButton: {
      padding: tokens.spacing.sm,
    },
    monthYearContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    monthYearButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
      marginHorizontal: tokens.spacing.xs,
      borderRadius: tokens.borderRadius.sm,
      backgroundColor: tokens.colors.surface,
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    monthText: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      marginRight: tokens.spacing.xs,
    },
    yearText: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      marginRight: tokens.spacing.xs,
    },
    weekDaysContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
      backgroundColor: tokens.colors.surfaceVariant,
    },
    weekDayCell: {
      flex: 1,
      padding: tokens.spacing.sm,
      alignItems: 'center',
    },
    weekDayText: {
      fontSize: tokens.typography.caption,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurfaceVariant,
    },
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: tokens.colors.surface,
    },
    calendarDay: {
      width: `${100 / 7}%`,
      minHeight: 50,
      padding: tokens.spacing.xs,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderRightWidth: 1,
      borderBottomColor: tokens.colors.border,
      borderRightColor: tokens.colors.border,
    },
    emptyDay: {
      width: `${100 / 7}%`,
      minHeight: 50,
      borderBottomWidth: 1,
      borderRightWidth: 1,
      borderBottomColor: tokens.colors.border,
      borderRightColor: tokens.colors.border,
    },
    selectedDay: {
      backgroundColor: tokens.colors.primary,
    },
    todayDay: {
      backgroundColor: tokens.colors.primaryContainer,
    },
    dayNumber: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      fontWeight: tokens.typography.regular,
    },
    selectedDayNumber: {
      color: tokens.colors.onPrimary,
      fontWeight: tokens.typography.bold,
    },
    todayDayNumber: {
      color: tokens.colors.onPrimaryContainer,
      fontWeight: tokens.typography.semibold,
    },
    dayIndicators: {
      flexDirection: 'row',
      marginTop: 2,
      justifyContent: 'center',
    },
    dayIndicator: {
      width: 10,
      height: 10,
      borderRadius: 3,
      marginHorizontal: 1,
    },
    selectedDateContainer: {
      flex: 1,
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surfaceVariant,
    },
    selectedDateTitle: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.md,
      textAlign: 'center',
    },
    classesScrollView: {
      flex: 1,
    },
    classItem: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.sm,
      padding: tokens.spacing.sm,
      marginBottom: tokens.spacing.sm,
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    classHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: tokens.spacing.xs,
    },
    classTime: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      marginLeft: tokens.spacing.sm,
      fontWeight: tokens.typography.semibold,
    },
    statusChip: {
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 2,
      borderRadius: tokens.borderRadius.sm,
      marginLeft: 'auto',
    },
    statusChipText: {
      fontSize: tokens.typography.caption,
      fontWeight: tokens.typography.semibold,
      textTransform: 'capitalize',
    },
    classTitle: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      fontWeight: tokens.typography.semibold,
      marginBottom: tokens.spacing.xs,
    },
    classInstructor: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
    },
    // Picker styles
    pickerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    pickerContainer: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.lg,
      width: '85%',
      maxWidth: 340,
      ...tokens.shadows.lg,
      overflow: 'hidden',
    },
    yearPickerContainer: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.lg,
      width: '70%',
      maxWidth: 280,
      ...tokens.shadows.lg,
      overflow: 'hidden',
    },
    pickerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: tokens.spacing.lg,
      backgroundColor: tokens.colors.primary,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
    },
    pickerTitle: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onPrimary,
    },
    closeButton: {
      padding: tokens.spacing.xs,
      borderRadius: tokens.borderRadius.sm,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    // Month grid styles
    monthGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: tokens.spacing.lg,
      backgroundColor: tokens.colors.surface,
      justifyContent: 'space-between',
    },
    monthGridItem: {
      width: '30%',
      aspectRatio: 2.2,
      marginBottom: tokens.spacing.md,
      backgroundColor: tokens.colors.surfaceVariant,
      borderRadius: tokens.borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
      ...tokens.shadows.sm,
    },
    monthGridItemSelected: {
      backgroundColor: tokens.colors.primary,
      borderColor: tokens.colors.primary,
      ...tokens.shadows.md,
    },
    monthGridItemText: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
    },
    monthGridItemTextSelected: {
      color: tokens.colors.onPrimary,
      fontWeight: tokens.typography.bold,
    },
    // Year grid styles
    yearGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: tokens.spacing.lg,
      backgroundColor: tokens.colors.surface,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    yearGridItem: {
      width: '42%',
      aspectRatio: 2.2,
      marginBottom: tokens.spacing.md,
      backgroundColor: tokens.colors.surfaceVariant,
      borderRadius: tokens.borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
      ...tokens.shadows.sm,
    },
    yearGridItemSelected: {
      backgroundColor: tokens.colors.primary,
      borderColor: tokens.colors.primary,
      ...tokens.shadows.md,
    },
    yearGridItemText: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
    },
    yearGridItemTextSelected: {
      color: tokens.colors.onPrimary,
      fontWeight: tokens.typography.bold,
    },
    // View Selector styles
    viewSelectorContainer: {
      flexDirection: 'row',
      backgroundColor: tokens.colors.surface,
      marginHorizontal: tokens.spacing.md,
      marginVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.md,
      padding: 4,
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    viewSelectorButton: {
      flex: 1,
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.md,
      borderRadius: tokens.borderRadius.sm,
      alignItems: 'center',
    },
    viewSelectorButtonActive: {
      backgroundColor: tokens.colors.primary,
    },
    viewSelectorText: {
      fontSize: tokens.typography.body,
      fontWeight: '500',
      color: tokens.colors.onSurfaceVariant,
    },
    viewSelectorTextActive: {
      color: tokens.colors.onPrimary,
      fontWeight: '600',
    },
    // Day View styles
    dayViewContainer: {
      flex: 1,
      backgroundColor: tokens.colors.surface,
    },
    dayViewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surfaceVariant,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
    },
    dayNavButton: {
      padding: tokens.spacing.sm,
    },
    dayViewDateContainer: {
      flex: 1,
      alignItems: 'center',
    },
    dayViewDate: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
    },
    dayViewScrollContainer: {
      flex: 1,
    },
    timeSlotContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
      minHeight: 80,
    },
    timeSlotHeader: {
      width: 80,
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.xs,
      backgroundColor: tokens.colors.surfaceVariant,
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderRightWidth: 1,
      borderRightColor: tokens.colors.border,
    },
    timeSlotText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      fontWeight: '500',
    },
    timeSlotContent: {
      flex: 1,
      padding: tokens.spacing.sm,
    },
    emptyTimeSlot: {
      height: 60,
    },
    dayClassItem: {
      backgroundColor: tokens.colors.primaryContainer,
      borderRadius: tokens.borderRadius.sm,
      padding: tokens.spacing.sm,
      marginBottom: tokens.spacing.xs,
      borderLeftWidth: 4,
      borderLeftColor: tokens.colors.primary,
    },
    dayClassHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: tokens.spacing.xs,
    },
    dayClassTitle: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      marginBottom: tokens.spacing.xs,
    },
    dayClassInstructor: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      marginBottom: tokens.spacing.xs,
    },
    dayClassTime: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.primary,
      fontWeight: '500',
    },
    // Week View styles
    weekViewContainer: {
      flex: 1,
      backgroundColor: tokens.colors.surface,
    },
    weekViewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surfaceVariant,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
    },
    weekNavButton: {
      padding: tokens.spacing.sm,
    },
    weekViewTitle: {
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
    },
    weekDaysHeader: {
      flexDirection: 'row',
      backgroundColor: tokens.colors.surfaceVariant,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
    },
    weekDayColumn: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: tokens.spacing.sm,
      borderRightWidth: 1,
      borderRightColor: tokens.colors.border,
    },
    weekDayName: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      fontWeight: '500',
    },
    weekDayNumber: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurface,
      fontWeight: tokens.typography.semibold,
      marginTop: 2,
    },
    todayWeekDay: {
      color: tokens.colors.primary,
      fontWeight: tokens.typography.bold,
    },
    weekViewScrollContainer: {
      flex: 1,
    },
    weekTimeSlotContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
      minHeight: 60,
    },
    weekTimeSlotHeader: {
      width: 80,
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.xs,
      backgroundColor: tokens.colors.surfaceVariant,
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderRightWidth: 1,
      borderRightColor: tokens.colors.border,
    },
    weekTimeSlotText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurfaceVariant,
      fontWeight: '500',
    },
    weekTimeSlotContent: {
      flex: 1,
      flexDirection: 'row',
    },
    weekDayTimeSlot: {
      flex: 1,
      padding: 2,
      borderRightWidth: 1,
      borderRightColor: tokens.colors.border,
    },
    weekClassItem: {
      backgroundColor: tokens.colors.primaryContainer,
      borderRadius: tokens.borderRadius.xs,
      padding: tokens.spacing.xs,
      marginBottom: 2,
      borderLeftWidth: 2,
      borderLeftColor: tokens.colors.primary,
    },
    weekClassTitle: {
      fontSize: tokens.typography.caption,
      fontWeight: tokens.typography.semibold,
      color: tokens.colors.onSurface,
      marginBottom: 1,
    },
    weekClassTime: {
      fontSize: 10,
      color: tokens.colors.primary,
      fontWeight: '500',
    },
  });