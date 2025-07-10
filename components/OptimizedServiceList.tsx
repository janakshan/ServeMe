// components/OptimizedServiceList.tsx
import { memo, useMemo } from 'react';
import { FlatList } from 'react-native';

interface Service {
  id: string;
  name: string;
  category: string;
}

interface ServiceListProps {
  services: Service[];
  onServicePress: (serviceId: string) => void;
}

const ServiceItem = memo(({ service, onPress }: { service: Service; onPress: (id: string) => void }) => (
  <ServiceCard 
    service={service} 
    onPress={() => onPress(service.id)}
  />
));

export const OptimizedServiceList = memo(({ services, onServicePress }: ServiceListProps) => {
  const keyExtractor = useMemo(() => (item: Service) => item.id, []);
  
  const renderItem = useMemo(() => 
    ({ item }: { item: Service }) => (
      <ServiceItem service={item} onPress={onServicePress} />
    ), 
    [onServicePress]
  );

  return (
    <FlatList
      data={services}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={5}
    />
  );
});