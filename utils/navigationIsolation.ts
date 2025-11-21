// Navigation Isolation Architecture - Create independent navigation contexts
// Implements true "separate apps" behavior between route groups

import React, { createContext, useContext } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

// Route group navigation container registry
export interface RouteGroupNavigationContainer {
  id: string;
  name: string;
  navigationRef: React.RefObject<NavigationContainerRef<any>>;
  isActive: boolean;
  canNavigateExternally: boolean;
}

// Navigation context manager for route group isolation
export class NavigationIsolationManager {
  private static instance: NavigationIsolationManager;
  private containers: Map<string, RouteGroupNavigationContainer> = new Map();
  private activeContainer: string | null = null;

  static getInstance(): NavigationIsolationManager {
    if (!NavigationIsolationManager.instance) {
      NavigationIsolationManager.instance = new NavigationIsolationManager();
    }
    return NavigationIsolationManager.instance;
  }

  // Register a route group navigation container
  registerContainer(container: RouteGroupNavigationContainer): void {
    this.containers.set(container.id, container);
    console.log(`🔗 Navigation Container Registered: ${container.name} (${container.id})`);
  }

  // Unregister a route group navigation container
  unregisterContainer(containerId: string): void {
    const container = this.containers.get(containerId);
    if (container) {
      this.containers.delete(containerId);
      console.log(`🔌 Navigation Container Unregistered: ${container.name} (${containerId})`);
    }
  }

  // Set the active navigation container
  setActiveContainer(containerId: string): void {
    // Deactivate all containers
    this.containers.forEach((container) => {
      container.isActive = false;
    });

    // Activate the specified container
    const container = this.containers.get(containerId);
    if (container) {
      container.isActive = true;
      this.activeContainer = containerId;
      console.log(`🎯 Active Navigation Container: ${container.name} (${containerId})`);
    }
  }

  // Get the active navigation container
  getActiveContainer(): RouteGroupNavigationContainer | null {
    if (this.activeContainer) {
      return this.containers.get(this.activeContainer) || null;
    }
    return null;
  }

  // Check if cross-container navigation is allowed
  canNavigateBetweenContainers(fromContainerId: string, toContainerId: string): boolean {
    const fromContainer = this.containers.get(fromContainerId);
    const toContainer = this.containers.get(toContainerId);

    if (!fromContainer || !toContainer) {
      return false;
    }

    // Allow navigation if both containers permit external navigation
    return fromContainer.canNavigateExternally && toContainer.canNavigateExternally;
  }

  // Perform isolated navigation between route groups
  navigateBetweenRouteGroups(
    fromContainerId: string,
    toContainerId: string,
    resetStack: boolean = true
  ): boolean {
    if (!this.canNavigateBetweenContainers(fromContainerId, toContainerId)) {
      console.warn(`❌ Navigation blocked: Cannot navigate from ${fromContainerId} to ${toContainerId}`);
      return false;
    }

    const fromContainer = this.containers.get(fromContainerId);
    const toContainer = this.containers.get(toContainerId);

    if (!fromContainer || !toContainer) {
      return false;
    }

    // Reset the source container's navigation stack if requested
    if (resetStack && fromContainer.navigationRef.current) {
      fromContainer.navigationRef.current.reset({
        index: 0,
        routes: [{ name: 'index' }], // Reset to initial route
      });
    }

    // Switch active container
    this.setActiveContainer(toContainerId);

    console.log(`🔀 Navigation Isolation: ${fromContainer.name} → ${toContainer.name}`);
    return true;
  }

  // Get all registered containers
  getAllContainers(): RouteGroupNavigationContainer[] {
    return Array.from(this.containers.values());
  }

  // Debug utility to print current navigation state
  debugNavigationState(): void {
    if (__DEV__) {
      console.log('🔍 Navigation Isolation State:');
      console.log(`Active Container: ${this.activeContainer || 'None'}`);
      console.log('Registered Containers:');
      this.containers.forEach((container, id) => {
        console.log(`  - ${id}: ${container.name} (Active: ${container.isActive})`);
      });
    }
  }
}

// Route Group Navigation Context
interface RouteGroupNavigationContextType {
  manager: NavigationIsolationManager;
  currentContainer: RouteGroupNavigationContainer | null;
  switchToRouteGroup: (containerId: string, resetStack?: boolean) => boolean;
  isIsolationActive: boolean;
}

const RouteGroupNavigationContext = createContext<RouteGroupNavigationContextType | null>(null);

// Hook to access route group navigation
export function useRouteGroupNavigation(): RouteGroupNavigationContextType {
  const context = useContext(RouteGroupNavigationContext);
  if (!context) {
    throw new Error('useRouteGroupNavigation must be used within a RouteGroupNavigationProvider');
  }
  return context;
}

// Route Group Navigation Provider
export function RouteGroupNavigationProvider({ children }: { children: React.ReactNode }) {
  const manager = NavigationIsolationManager.getInstance();
  const currentContainer = manager.getActiveContainer();

  const switchToRouteGroup = (containerId: string, resetStack: boolean = true): boolean => {
    const currentContainerId = manager.getActiveContainer()?.id;
    if (currentContainerId) {
      return manager.navigateBetweenRouteGroups(currentContainerId, containerId, resetStack);
    }
    return false;
  };

  const contextValue: RouteGroupNavigationContextType = {
    manager,
    currentContainer,
    switchToRouteGroup,
    isIsolationActive: manager.getAllContainers().length > 0,
  };

  return (
    <RouteGroupNavigationContext.Provider value={contextValue}>
      {children}
    </RouteGroupNavigationContext.Provider>
  );
}

// Predefined route group container configurations
export const ROUTE_GROUP_CONTAINERS = {
  AUTH: {
    id: 'auth-container',
    name: 'Authentication',
    canNavigateExternally: true,
  },
  MAIN_APP: {
    id: 'main-app-container',
    name: 'Main Application',
    canNavigateExternally: true,
  },
  EDUCATION: {
    id: 'education-container',
    name: 'Education Service',
    canNavigateExternally: true,
  },
  BOOKING: {
    id: 'booking-container',
    name: 'Booking Service',
    canNavigateExternally: true,
  },
  HEALTHCARE: {
    id: 'healthcare-container',
    name: 'Healthcare Service',
    canNavigateExternally: true,
  },
  ENTERTAINMENT: {
    id: 'entertainment-container',
    name: 'Entertainment Service',
    canNavigateExternally: true,
  },
} as const;

// Utility to create a navigation container ref for a route group
export function createRouteGroupNavigationRef() {
  return React.createRef<NavigationContainerRef<any>>();
}

// Deep linking integration for isolated navigation
export interface DeepLinkRouteMapping {
  routeGroup: string;
  internalRoute: string;
  containerId: string;
}

export class DeepLinkManager {
  private static routeMappings: Map<string, DeepLinkRouteMapping> = new Map();

  static registerDeepLinkRoute(
    externalRoute: string,
    mapping: DeepLinkRouteMapping
  ): void {
    this.routeMappings.set(externalRoute, mapping);
    console.log(`🔗 Deep Link Route Registered: ${externalRoute} → ${mapping.routeGroup}`);
  }

  static handleDeepLink(url: string): boolean {
    const manager = NavigationIsolationManager.getInstance();
    
    // Parse the URL to find matching route mapping
    for (const [route, mapping] of this.routeMappings.entries()) {
      if (url.includes(route)) {
        // Switch to the appropriate container
        const currentContainer = manager.getActiveContainer();
        if (currentContainer && currentContainer.id !== mapping.containerId) {
          manager.navigateBetweenRouteGroups(
            currentContainer.id,
            mapping.containerId,
            true // Reset stack for deep links
          );
        } else {
          manager.setActiveContainer(mapping.containerId);
        }

        // Navigate to internal route within the container
        const targetContainer = manager.containers.get(mapping.containerId);
        if (targetContainer?.navigationRef.current) {
          targetContainer.navigationRef.current.navigate(mapping.internalRoute as never);
        }

        console.log(`🔗 Deep Link Handled: ${url} → ${mapping.routeGroup}/${mapping.internalRoute}`);
        return true;
      }
    }

    console.warn(`⚠️ Unhandled Deep Link: ${url}`);
    return false;
  }
}