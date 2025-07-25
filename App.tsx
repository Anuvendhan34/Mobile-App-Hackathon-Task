"use client"

import { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { auth } from "./firebase"
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth"
import * as Google from "expo-auth-session/providers/google"
import * as WebBrowser from "expo-web-browser"
import LoginScreen from "./components/LoginScreen"
import DashboardScreen from "./components/DashboardScreen"
import ProfileScreen from "./components/ProfileScreen"
import AddEditTaskModal from "./components/AddEditTaskModal"

WebBrowser.maybeCompleteAuthSession()

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  dueTime?: string
  priority: "Low" | "Medium" | "High"
  status: "Open" | "Complete"
  createdAt: string
  completedAt?: string
}

export interface User {
  name: string
  avatar: string
  email: string
  phone?: string
}

const Stack = createStackNavigator()

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [showAddTask, setShowAddTask] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loginError, setLoginError] = useState("")
  const [showProfile, setShowProfile] = useState(false)
  const [completedTasksCount, setCompletedTasksCount] = useState(0)
  const [unlockedMedals, setUnlockedMedals] = useState<string[]>([])
  const [showMedalAnimation, setShowMedalAnimation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [request, response, promptAsync] = Google.useAuthRequest({
  expoClientId: "292601260400-s0k1aes6pjk32idg6f780avlagbti67j.apps.googleusercontent.com",
  androidClientId: "your-android-client-id.apps.googleusercontent.com",
  iosClientId: "your-ios-client-id.apps.googleusercontent.com",
  webClientId: "your-web-client-id.apps.googleusercontent.com",
})




  // Load persisted data on app start
  useEffect(() => {
    loadPersistedData()
  }, [])

  const loadPersistedData = async () => {
    try {
      const savedCount = await AsyncStorage.getItem("completedTasksCount")
      const savedMedals = await AsyncStorage.getItem("unlockedMedals")
      const savedUser = await AsyncStorage.getItem("userData")

      if (savedCount) {
        setCompletedTasksCount(Number.parseInt(savedCount, 10))
      }

      if (savedMedals) {
        setUnlockedMedals(JSON.parse(savedMedals))
      }

      if (savedUser && isLoggedIn) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error("Error loading persisted data:", error)
    }
  }

  // Persist data whenever it changes
  useEffect(() => {
    AsyncStorage.setItem("completedTasksCount", completedTasksCount.toString())
  }, [completedTasksCount])

  useEffect(() => {
    AsyncStorage.setItem("unlockedMedals", JSON.stringify(unlockedMedals))
  }, [unlockedMedals])

  useEffect(() => {
    if (user) {
      AsyncStorage.setItem("userData", JSON.stringify(user))
    }
  }, [user])

  // Handle Google Auth Response
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response
      if (authentication?.accessToken) {
        signInWithGoogle(authentication.accessToken)
      }
    }
  }, [response])

  const signInWithGoogle = async (accessToken: string) => {
    try {
      const credential = GoogleAuthProvider.credential(null, accessToken)
      const result = await signInWithCredential(auth, credential)
      const firebaseUser = result.user

      const newUser: User = {
        name: firebaseUser.displayName || "Unknown",
        avatar: firebaseUser.photoURL || "",
        email: firebaseUser.email || "",
        phone: firebaseUser.phoneNumber || "",
      }

      setUser(newUser)
      setIsLoggedIn(true)
      loadSampleTasks()
    } catch (error: any) {
      console.error("Google sign in error:", error)
      setLoginError(error.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    setLoginError("")
    setIsLoading(true)
    try {
      await promptAsync()
    } catch (error: any) {
      console.error(error)
      setLoginError(error.message || "Login failed")
      setIsLoading(false)
    }
  }

  const loadSampleTasks = () => {
    const sampleTasks: Task[] = [
      {
        id: "1",
        title: "Complete project proposal",
        description: "Finish the Q4 project proposal for the client meeting",
        dueDate: "2024-01-15",
        dueTime: "14:30",
        priority: "High",
        status: "Open",
        createdAt: "2024-01-10",
      },
      {
        id: "2",
        title: "Buy groceries",
        description: "Milk, bread, eggs, and vegetables",
        dueDate: "2024-01-12",
        dueTime: "10:00",
        priority: "Medium",
        status: "Complete",
        createdAt: "2024-01-11",
        completedAt: "2024-01-12T09:30:00Z",
      },
      {
        id: "3",
        title: "Call dentist",
        description: "Schedule annual checkup appointment",
        dueDate: "2024-01-20",
        priority: "Low",
        status: "Open",
        createdAt: "2024-01-09",
      },
    ]
    setTasks(sampleTasks)
  }

  const handleAddTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [newTask, ...prev])
    setShowAddTask(false)
  }

  const handleEditTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    if (!editingTask) return
    const updatedTask = { ...editingTask, ...taskData }
    setTasks((prev) => prev.map((task) => (task.id === editingTask.id ? updatedTask : task)))
    setEditingTask(null)
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedTask: Task = {
            ...task,
            status: task.status === "Open" ? "Complete" : "Open",
            completedAt: task.status === "Open" ? new Date().toISOString() : undefined,
          }

          if (updatedTask.status === "Complete" && task.status === "Open") {
            const newCount = completedTasksCount + 1
            setCompletedTasksCount(newCount)
            checkForNewMedals(newCount)
          } else if (updatedTask.status === "Open" && task.status === "Complete") {
            const newCount = Math.max(0, completedTasksCount - 1)
            setCompletedTasksCount(newCount)
          }

          return updatedTask
        }
        return task
      }),
    )
  }

  const checkForNewMedals = (count: number) => {
    const medals = []
    if (count >= 50) medals.push("bronze")
    if (count >= 100) medals.push("silver")
    if (count >= 200) medals.push("gold")

    const newMedals = medals.filter((m) => !unlockedMedals.includes(m))
    if (newMedals.length > 0) {
      setUnlockedMedals(medals)
      setShowMedalAnimation(newMedals[0])
      setTimeout(() => setShowMedalAnimation(null), 3000)
    }
  }

  const handleResetCompletedTasks = async () => {
    setCompletedTasksCount(0)
    setUnlockedMedals([])
    await AsyncStorage.setItem("completedTasksCount", "0")
    await AsyncStorage.setItem("unlockedMedals", "[]")
  }

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser)
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login">
            {() => <LoginScreen onLogin={handleLogin} error={loginError} isLoading={isLoading} />}
          </Stack.Screen>
        ) : showProfile ? (
          <Stack.Screen name="Profile">
            {() => (
              <ProfileScreen
                user={user}
                completedTasksCount={completedTasksCount}
                unlockedMedals={unlockedMedals}
                recentTasks={tasks.filter((t) => t.status === "Complete").slice(0, 5)}
                onBack={() => setShowProfile(false)}
                showMedalAnimation={showMedalAnimation}
                onResetCompletedTasks={handleResetCompletedTasks}
                onUpdateUser={handleUpdateUser}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Dashboard">
            {() => (
              <>
                <DashboardScreen
                  user={user}
                  tasks={tasks}
                  onAddTask={() => setShowAddTask(true)}
                  onEditTask={setEditingTask}
                  onDeleteTask={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                  onShowProfile={() => setShowProfile(true)}
                />
                {showAddTask && <AddEditTaskModal onSave={handleAddTask} onCancel={() => setShowAddTask(false)} />}
                {editingTask && (
                  <AddEditTaskModal task={editingTask} onSave={handleEditTask} onCancel={() => setEditingTask(null)} />
                )}
              </>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
