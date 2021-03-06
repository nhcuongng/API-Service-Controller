import React from 'react';

export const DisplayResult: React.FC<{ txt: string }> = ({ txt }) => (<pre>{txt}</pre>);