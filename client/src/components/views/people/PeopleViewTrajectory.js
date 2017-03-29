/**
 * BHHT Datascape People View Trajectory Component
 * ================================================
 *
 * Component rendering the list of a person's contact points.
 */
import React from 'react';
import {createWikipediaLabel} from 'lib/helpers';
import Link from '../../Link';

export default function PeopleViewTrajectory(props) {
  const {
    points
  } = props;

  return (
    <table className="table is-striped">
      <thead>
        <tr>
          <th>#.</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        {points.map((point, i) => {
          return (
            <tr key={i}>
              <td style={{width: '20px'}}>
                {i + 1}
              </td>
              <td>
                <Link to={`/location/${point.location}`}>
                  {createWikipediaLabel(point.location)}
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
