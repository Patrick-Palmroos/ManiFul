import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  GestureResponderEvent,
  Modal,
} from 'react-native';
import { ImageScanType } from '../../../../types/raspberry';
import { useTypes } from '../../../../context/TypesContext';
import text from '../../../../styles/text';
import { useState, useEffect } from 'react';
import DatePicker from 'react-native-date-picker';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { transactionPost } from '../../../../types/data';
import { useTransactions } from '../../../../context/TransactionContext';
import { useModalContext } from '../../../../context/ModalContext';
import colors from '../../../../styles/colors';
import styles from './styles';
import TypeChangeModal from '../TypeChangeModal/TypeChangeModal';

import { showMessage } from 'react-native-flash-message';

type displayDataGroup = {
  category_id: number;
  category_name: string;
  items: {
    name: string;
    price: number;
    discount: number | null;
    type_id: number;
    type_name: string;
  }[];
};

const stringToDate = (dateString: string) => {
  const [day, month, year] = dateString.split('.');
  return new Date(Number(year), Number(month) - 1, Number(day));
};

const dateToText = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

//TODO: changing types.
//TODO: removing and adding items
const ReceiptContents = ({
  data,
  close,
}: {
  data: ImageScanType;
  close: () => void;
}) => {
  const { categories, types } = useTypes();
  const [date, setDate] = useState<Date>(
    data.date ? stringToDate(data.date) : new Date(),
  );
  const [vendor, setVendor] = useState<string>(
    data.vendor ? data.vendor : 'No vendor',
  );
  const [dateOpen, setDateOpen] = useState<boolean>(false);
  const [editableItems, setEditableItems] = useState<displayDataGroup[]>([]);
  const [selection, setSelection] = useState<
    | {
        start: number;
        end?: number;
      }
    | undefined
  >({ start: 0 });
  const [tempInputValues, setTempInputValues] = useState<{
    [key: string]: string;
  }>({});
  const { createTransaction } = useTransactions();
  const { closeAllModals, openModal, closeModal } = useModalContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<{
    groupIndex: number;
    itemIndex: number;
  } | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const handleItemPress = (
    event: GestureResponderEvent,
    groupIndex: number,
    itemIndex: number,
  ) => {
    const { pageX, pageY } = event.nativeEvent;
    setPopupPosition({ x: pageX, y: pageY });
    setSelectedItem({ groupIndex, itemIndex });
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedItem(null);
  };

  const handleBlur = () => {
    setSelection({ start: 0 });
  };

  if (!categories || !types || !editableItems) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  useEffect(() => {
    if (categories && types && data) {
      const initialGroupItems = categories
        .map(category => {
          // Get all type IDs for this category
          const categoryTypeIds = category.types.map(type => type.id);

          // Filter items that belong to any of these types
          const itemsForCategory = data.items
            .filter(
              item => item.type_id && categoryTypeIds.includes(item.type_id),
            )
            .map(item => {
              // Find the specific type to get its name
              const itemType = category.types.find(
                type => type.id === item.type_id,
              );
              return {
                ...item,
                type_name: itemType?.name || 'Unknown',
              };
            });

          // Only include categories with items
          return itemsForCategory.length > 0
            ? {
                category_id: category.id,
                category_name: category.name,
                items: itemsForCategory,
              }
            : null;
        })
        .filter((group): group is displayDataGroup => group !== null);
      setEditableItems(initialGroupItems);
    }
  }, []);

  const updateItemField = (
    groupIndex: number,
    itemIndex: number,
    field: keyof displayDataGroup['items'][0],
    value: string | number | null,
  ) => {
    setEditableItems(prev => {
      const updated = [...prev];
      const itemToUpdate = { ...updated[groupIndex].items[itemIndex] };

      if (field === 'price' || field === 'discount' || field === 'type_id') {
        const numberValue = Number(value);
        if (!isNaN(numberValue)) {
          itemToUpdate[field] = numberValue as any;
        } else {
          return prev;
        }
      } else if (field === 'name' || field === 'type_name') {
        itemToUpdate[field] = (value ?? '') as any;
      }

      updated[groupIndex].items[itemIndex] = itemToUpdate;
      return updated;
    });
  };

  const handleOnConfirm = async () => {
    try {
      setLoading(true);

      const res: transactionPost = {
        total: getTotal(),
        vendor: vendor,
        date: date.toISOString(),
        items: editableItems.flatMap(cat =>
          cat.items.map(item => ({
            type_id: item.type_id,
            name: item.name,
            total: item.price,
          })),
        ),
      };

      const result = await createTransaction(res);
      console.log(result);
      if (result) {
        showMessage({
          message: 'Successfully saved transaction!',
          description: 'Your receipt transaction has been successfully saved.',
          duration: 5000,
          floating: true,
          type: 'success',
        });
        closeAllModals();
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const getTotal = () => {
    const total = editableItems
      .flatMap(cat => cat.items.map(item => item.price))
      .reduce((sum, price) => sum + price, 0);

    return parseFloat(total.toFixed(2)); // Ensures it's a number, not a string
  };

  const handleDelete = () => {
    if (!selectedItem) return;

    const { groupIndex, itemIndex } = selectedItem;

    setEditableItems(prev => {
      const updated = [...prev];
      const group = updated[groupIndex];

      if (!group) return prev;

      group.items.splice(itemIndex, 1);

      // Remove group if no items
      if (group.items.length === 0) {
        updated.splice(groupIndex, 1);
      }

      return updated;
    });
    console.log(`Deleted: ${selectedItem}`);
    setPopupVisible(false);
    setSelectedItem(null);
  };

  const handleTypeSelect = (typeId: number, typeName: string) => {
    if (!selectedItem) return;
    const { groupIndex, itemIndex } = selectedItem;

    // Get the item being updated
    const updatedItem = {
      ...editableItems[groupIndex].items[itemIndex],
      type_id: typeId,
      type_name: typeName,
    };

    //Flatten all other items (excluding the updated one)
    const allOtherItems = editableItems.flatMap((group, gi) =>
      group.items
        .filter((_, ii) => !(gi === groupIndex && ii === itemIndex))
        .map(item => ({ ...item })),
    );

    //Add the updated item
    const allItems = [...allOtherItems, updatedItem];

    // Regroup based on categories and types
    const regrouped = categories
      .map(category => {
        const categoryTypeIds = category.types.map(t => t.id);

        const itemsInCategory = allItems.filter(item =>
          categoryTypeIds.includes(item.type_id),
        );

        return itemsInCategory.length > 0
          ? {
              category_id: category.id,
              category_name: category.name,
              items: itemsInCategory,
            }
          : null;
      })
      .filter((group): group is displayDataGroup => group !== null);

    setEditableItems(regrouped);
    closeModal('typeChange');

    setSelectedItem(null);
  };

  return (
    <View
      style={{
        height: 500,
      }}>
      <TextInput
        style={styles.vendorInput}
        value={vendor}
        onBlur={handleBlur}
        onFocus={() =>
          setSelection({
            start: vendor.length,
            end: vendor.length,
          })
        }
        selection={selection}
        onChangeText={text => setVendor(text)}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginRight: 20,
        }}>
        <View style={{ flexDirection: 'row', gap: 10, padding: 5 }}>
          <Text style={{ ...text.regular, fontFamily: 'Rubik-Medium' }}>
            {dateToText(date)}
          </Text>
          <TouchableOpacity
            style={styles.dateEditButton}
            onPress={() => setDateOpen(true)}>
            <MaterialIcons name="edit" size={15} color={'white'} />
          </TouchableOpacity>
        </View>
        <DatePicker
          modal
          mode="date"
          locale="en" // change to fi for finnish
          date={date}
          open={dateOpen}
          onCancel={() => setDateOpen(false)}
          onConfirm={date => {
            setDateOpen(false);
            setDate(date);
          }}
        />
        <Text style={{ ...text.moneyDark, color: colors.textDefault }}>
          Total: <Text style={text.moneyDark}>{getTotal()}€</Text>
        </Text>
      </View>
      <ScrollView
        style={{
          marginVertical: 8,
        }}
        persistentScrollbar
        contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableWithoutFeedback>
          <View>
            {editableItems.map((group, groupIndex) => (
              <View
                key={groupIndex}
                style={{
                  backgroundColor: colors.backgroundWarm,
                  padding: 5,
                  paddingLeft: 0,
                  borderRadius: 5,
                }}>
                <Text style={{ ...text.title, fontSize: 24 }}>
                  {group.category_name}
                </Text>
                {/* Items */}
                {group.items.map((item, itemIndex) => (
                  <Pressable
                    key={itemIndex}
                    onPressIn={() => setSelected(itemIndex)}
                    onPressOut={() => setSelected(null)}
                    onLongPress={e => handleItemPress(e, groupIndex, itemIndex)}
                    style={{
                      ...styles.itemContainer,
                      backgroundColor:
                        selectedItem === null
                          ? selected === itemIndex
                            ? '#dbbacb'
                            : itemIndex & 1
                            ? '#edd1e0'
                            : colors.backgroundWarm
                          : selectedItem.itemIndex === itemIndex &&
                            selectedItem.groupIndex === groupIndex
                          ? colors.backgroundWarm
                          : '#dbbacb',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '100%',
                        width: '70%',
                      }}>
                      {/* Name */}
                      <TextInput
                        style={styles.nameInputField}
                        value={item.name}
                        onBlur={handleBlur}
                        onFocus={() =>
                          setSelection({
                            start: item.name.length,
                            end: item.name.length,
                          })
                        }
                        selection={selection}
                        onChangeText={text =>
                          updateItemField(groupIndex, itemIndex, 'name', text)
                        }
                      />
                      {/* Type */}
                      <View
                        style={{
                          ...text.regular,
                          width: '30%',
                          marginTop: 5,
                          marginBottom: 5,
                        }}>
                        <Text style={styles.typeText}>{item.type_name}</Text>
                      </View>
                    </View>
                    {/* Price */}
                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        width: '35%',
                        paddingRight: 13,
                      }}>
                      <TextInput
                        multiline={true} // for some god forsaken reason this fixes scroll being blocked by text align..
                        numberOfLines={1}
                        style={{
                          ...text.moneyDark,
                          textDecorationLine: 'underline',
                          textAlign: 'right',
                          width: '85%',
                          paddingRight: 2,
                        }}
                        value={
                          tempInputValues[`${groupIndex}-${itemIndex}-price`] ??
                          item.price.toString()
                        }
                        keyboardType="numeric"
                        onBlur={() => {
                          handleBlur();

                          const temp =
                            tempInputValues[`${groupIndex}-${itemIndex}-price`];
                          const parsed = Number(temp?.replace(',', '.'));

                          if (!isNaN(parsed)) {
                            updateItemField(
                              groupIndex,
                              itemIndex,
                              'price',
                              parsed,
                            );
                          }

                          // Clean up temporary input
                          setTempInputValues(prev => {
                            const updated = { ...prev };
                            delete updated[`${groupIndex}-${itemIndex}-price`];
                            return updated;
                          });
                        }}
                        onFocus={() =>
                          setSelection({
                            start: item.name.length,
                            end: item.name.length,
                          })
                        }
                        selection={selection}
                        onChangeText={text => {
                          setTempInputValues(prev => ({
                            ...prev,
                            [`${groupIndex}-${itemIndex}-price`]: text,
                          }));
                        }}
                      />
                      <Text style={text.moneyDark}>€</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        </TouchableWithoutFeedback>
        {/* Popup for deleting and selecting edit */}
        {popupVisible && (
          <Modal transparent>
            <TouchableWithoutFeedback onPress={closePopup}>
              <View style={{ flex: 1 }}>
                <TouchableWithoutFeedback>
                  <View
                    style={[
                      styles.popup,
                      {
                        top: popupPosition.y - 90,
                        left: popupPosition.x + 10,
                      },
                    ]}>
                    <TouchableOpacity onPress={handleDelete}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 2,
                        }}>
                        <MaterialIcons
                          name="delete-outline"
                          size={25}
                          color={'#ffffffff'}
                        />
                        <Text style={{ ...text.regularLight, fontSize: 15 }}>
                          Delete
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        openModal(
                          <TypeChangeModal callback={handleTypeSelect} />,
                          'typeChange',
                        );
                        setPopupVisible(false);
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4,
                        }}>
                        <MaterialIcons
                          name="edit"
                          size={23}
                          color={'#ffffffff'}
                        />
                        <Text style={{ ...text.regularLight, fontSize: 15 }}>
                          Change type
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </ScrollView>
      {/* Cancel and save buttons */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: 10,
        }}>
        <TouchableOpacity
          onPress={close}
          disabled={loading}
          style={{
            ...styles.button,
            backgroundColor: loading ? 'grey' : colors.cancelButton,
          }}>
          <Text style={{ ...text.regularLight, textAlign: 'center' }}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleOnConfirm}
          disabled={loading}
          touchSoundDisabled={loading}
          style={{
            ...styles.button,
            backgroundColor: colors.confirmButton,
          }}>
          {loading ? (
            <ActivityIndicator color={colors.light} style={{ marginTop: 2 }} />
          ) : (
            <Text style={{ ...text.regularLight, textAlign: 'center' }}>
              Save
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReceiptContents;
