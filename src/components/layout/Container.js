/** @jsx jsx */
import React, { Component, useState } from 'react'
import { jsx, css } from '@emotion/core'
import { default_theme as theme } from '../../emotion/theme'
import { getGlobalHttpCounter } from '../../orm/http_adapter'

export const Container = ({children, className}) => {

    return (
        <div className={className}>
          {children}
        </div>
    )

}
