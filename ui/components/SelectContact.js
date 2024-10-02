import React from 'react'; // Importing React to use JSX and create components
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'; // Importing Listbox components from Headless UI for custom dropdown functionality
import CheckIcon from '@heroicons/react/24/solid/CheckIcon'; // Icon for indicating selected option
import ChevronUpDownIcon from '@heroicons/react/24/solid/ChevronUpDownIcon'; // Icon for dropdown arrow

// SelectContact component for displaying a dropdown of contacts
export const SelectContact = ({
  title,
  selectedContact,
  setContact,
  contacts,
}) => (
  <Listbox value={selectedContact} onChange={setContact}>
    {' '}
    {/* Listbox component to handle selection */}
    <Label className="block text-sm font-medium leading-6 text-gray-900">
      {' '}
      {/* Label for the dropdown */}
      {title}
    </Label>
    <div className="relative mt-2">
      {' '}
      {/* Container for the dropdown and options */}
      <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
        <span className="flex items-center">
          {' '}
          {/* Flex container for selected contact display */}
          {selectedContact?.imageUrl && ( // If a selected contact has an image
            <img
              alt="" // Alt text can be more descriptive
              src={selectedContact.imageUrl} // Source of the contact's image
              className="h-5 w-5 flex-shrink-0 rounded-full" // Styling for the image
            />
          )}
          <span className="ml-3 block truncate">
            {' '}
            {/* Display name of the selected contact or placeholder */}
            {selectedContact?.name || 'Select a contact'}
          </span>
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
          {' '}
          {/* Arrow icon for dropdown */}
          <ChevronUpDownIcon
            aria-hidden="true"
            className="h-5 w-5 text-gray-400"
          />
        </span>
      </ListboxButton>
      {/* Options for the dropdown list */}
      <ListboxOptions
        transition
        className="absolute z-10 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
      >
        {!contacts.length && ( // If no contacts are available, show a disabled option
          <ListboxOption
            disabled
            className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
          >
            <div className="flex items-center">
              <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                No contacts found
              </span>
            </div>
          </ListboxOption>
        )}

        {/* Map through contacts to display each as an option */}
        {contacts.map((contact) => (
          <ListboxOption
            key={contact._id} // Unique key for each option
            value={contact} // Value of the option
            className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
          >
            <div className="flex items-center">
              {contact.imageUrl && ( // If contact has an image, display it
                <img
                  alt="" // Alt text can be more descriptive
                  src={contact.imageUrl} // Source of the contact's image
                  className="h-5 w-5 flex-shrink-0 rounded-full" // Styling for the image
                />
              )}
              <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                {contact.name} {/* Display contact name */}
              </span>
            </div>

            {selectedContact?._id === contact._id && ( // If this contact is selected, show a check icon
              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                <CheckIcon aria-hidden="true" className="h-5 w-5" />
              </span>
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </div>
  </Listbox>
);
